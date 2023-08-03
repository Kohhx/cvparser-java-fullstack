package com.avensys.CVparserApplication.resume;

import com.avensys.CVparserApplication.company.Company;
import com.avensys.CVparserApplication.company.CompanyRepository;
import com.avensys.CVparserApplication.exceptions.ResourceAccessDeniedException;
import com.avensys.CVparserApplication.exceptions.ResourceNotFoundException;
import com.avensys.CVparserApplication.exceptions.UploadFileException;
import com.avensys.CVparserApplication.openai.*;
import com.avensys.CVparserApplication.skill.Skill;
import com.avensys.CVparserApplication.skill.SkillRepository;
import com.avensys.CVparserApplication.user.User;
import com.avensys.CVparserApplication.user.UserRepository;
import com.avensys.CVparserApplication.user.UserResponseDTO;
import com.avensys.CVparserApplication.utility.ComparatorUtil;
import com.avensys.CVparserApplication.utility.DateUtil;
import com.avensys.CVparserApplication.utility.FileUtil;
import com.avensys.CVparserApplication.utility.GPTUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Service
public class ResumeService {
    public final UserRepository userRepository;
    public final ResumeRepository resumeRepository;
    public final SkillRepository skillRepository;
    public final CompanyRepository companyRepository;
//    public final FirebaseStorageService firebaseStorageService;
    public final RestTemplate restTemplate;
    public final double chatGPTTemperature = 0.9;
    private static final int NUM_THREADS = 10;


    @Value("${openai.model}")
    private String chatModel;

    @Value("${openai.api.url}")
    private String openAiUrl;
    private String extractText;

    private final String GPTPROMPT1 =
            """
                       Please help me extract the following fields from each CV and use the followings as the keys:
                                name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase.
                                email (string): The email address of the candidate.
                                mobile (string): The mobile number of the candidate.
                                skills (array): The skills possessed by the candidate. 
                                yearsOfExperience (number): The number of years of job experience of the candidate only.Exclude education and trainings. Please calculate the total number of year if he is working till present/current year which is 2023.
                                companies (array): The names of the recent 3 companies the candidate has worked for.
                                                
                                Please return only the JSON format. Please do not return any other strings. Ensure that the JSON format is valid.       
                                                   
                    """;

    private final String GPTPROMPT2 =
            """
                       Please help me extract the following fields from a part of a CV and use the followings as the keys:
                                name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase. If not provided, return empty.
                                email (string): The email address of the candidate. If not provided, return empty.
                                mobile (string): The mobile number of the candidate. If not provided, return empty.
                                skills (array): The skills possessed by the candidate.
                                yearsOfExperience (number): The number of years of job experience.
                                companies (array): The names of the recent 3 companies the candidate has worked for.
                                                
                                Please return only the JSON format. Please do not return any other strings.  
                                Please return only the JSON format. Please do not return any other strings in the response.  Ensure that the JSON format is valid.
                                The following text is only a portion of a CV.
                                            
                    """;

    private final String GPTPROMPT3 =
            """
                    Please help me extract the following fields from each CV and use the followings as the keys:\s
                                                     name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase.\s
                                                     firstName (string): The first name of the candidate. Letter of each word is capital, the rest are lowercase.\s
                                                     lastName (string): The last name of the candidate. Letter of each word is capital, the rest are lowercase.\s
                                                     gender (string): The gender of the candidate, return either "male" or "female". If not present, try to guess from the name. \s
                                                     spokenLanguages (array): All the languages that the candidate speaks. If not present, return the language used to write this resume. \s
                                                     email (string): The email address of the candidate.\s
                                                     mobile (string): The mobile number of the candidate.\s
                                                     skills (array): The skills possessed by the candidate. All skills. If cannot find, infer his skills from resume content. \s
                                                     primarySkills (array): The skills possessed by the candidate, frequently appearing throughout the resume. Just technical skills and software skills, no linguistic languages.\s
                                                     secondarySkills (array): The skills possessed by the candidate, but doesn't show up in the primary skills.\s
                                                     currentLocation (string): return the candidate's current country he/she resides in. If not available, just use the location of the candidate latest employment.\s 
                                                     nationality (string): Return the nationality based on the country the candidate is born in. If not present, get the nationality from the currentLocation. \s
                                                     companiesDetails (array): return all the companies the candidate worked with including internships. Array should ordered from the latest to earliest.\s
                                                     1)	name:(string) name of the company . If nothing, return "".
                                                     2)	startDate: (string) start date of employment typically in the format "month/year", if nothing, just use end date of previous job.
                                                     3)	endDate: (string) end date. Use this format for output "month/year". If no end date, just use 2023-06, present == 2023-06
                                                     4)	noOfYears: (decimal) Number of employment years in the company. Else return 0.0. If start date is empty, then is 0. If there is only start date, then take take it as 1 year.
                                                     5) jobTitle: The candidate's job title for this job. \s
                                                     yearsOfExperience (number): Total employment in years including internship based on the information in companiesDetails (array). Convert all the months to years. Return only the total value only, but if there are overlapping months, do not double count. Verify by adding up all the noOfYears from companiesDetails array.
                                                     1)Exclude education and trainings.\s
                                                     2) If candidate mention only present date without start date, then calculate years based on the last working date to present.
                                                     3) If candidate mention start date to present date, then calculate years based on the start date to present date.
                                                     4) Present year is 2023.
                                                     5) Employment dates for each position mentioned in your career history. Include the month and year for both the start and end dates of each job.
                                                     If any positions have unspecified employment dates, please mention that explicitly. Based on these, calculate the number of employment years of the candidate.
                                                     6) Please return number of years. Not months.
                                                     7) Always use candidate stated start date to end date first.
                                                     8) present always refer to end date.
                                                     companies (array): The names of the recent 3 companies the candidate has worked for. Do not return duplicate companies.
                                                     education (string): Give me the candidate highest education qualification in the resume.
                                                     jobTitle (string): return the candidate's job title of his/her latest job in the companiesDetail.
                                                     profile (string): return the about me section about the candidate from the resume else summarize into a readable paragraph. 
                                                     Please return only the JSON format. Please do not return any other strings. Ensure that the JSON format is valid and complete according to the above requirements.The following is a chunk of a CV.
                                                     Complete the response before returning the response. For any empty results, reparse the resume again and get a result.
                    """;


    private final String GPTPROMPT3_2 =
            """
                                
                    Above is the result from previous response. Use this as the input for the next response. Add the new extracted information to this and merge them to give the final JSON output.
                           
                            """;

    private final String GPTPROMPT3BK =
            """
                    Please help me extract the following fields from each CV and use the followings as the keys:\s
                                                     name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase.\s
                                                     email (string): The email address of the candidate.\s
                                                     mobile (string): The mobile number of the candidate.\s
                                                     skills (array): The skills possessed by the candidate. Both technical skills and soft skills.
                                                     companiesDetails (array): All the companies the candidate worked with.
                                                     1)	name:(string) name of the company 
                                                     2)	startDate: (string) start date 
                                                     3)	endDate: (string) end date || Jan 2023 || if present, then Jan 2023
                                                     4)	noOfYears: (decimal) Number of employment years in the company. Else 0.0. If start date is empty, then is 0\s
                                                     yearsOfExperience (number): Total employment in years based on the information in companiesDetails (array). Convert all the months to years. Return only the total value only. Verify by adding up all the noOfYears from companiesDetails array.
                                                     1)Exclude education and trainings.\s
                                                     2) If candidate mention only present date without start date, then calculate years based on the last working date to present.
                                                     3) If candidate mention start date to present date, then calculate years based on the start date to present date.
                                                     4) Present year is 2023.
                                                     5) Employment dates for each position mentioned in your career history. Include the month and year for both the start and end dates of each job.
                                                     If any positions have unspecified employment dates, please mention that explicitly. Based on these, calculate the number of employment years of the candidate.
                                                     6) Please return number of years. Not months.
                                                     7) Always use candidate stated start date to end date first.
                                                     8) present always refer to end date.
                                                     companies (array): The names of the recent 3 companies the candidate has worked for.
                                                     
                                                     Please return only the JSON format. Please do not return any other strings. Ensure that the JSON format is valid.
                    """;

    private final String GPTPROMPT3Bk2 =
            """
                    Please help me extract the following fields from each CV and use the followings as the keys:\s
                                                     name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase.\s
                                                     email (string): The email address of the candidate.\s
                                                     mobile (string): The mobile number of the candidate.\s
                                                     skills (array): The skills possessed by the candidate. Both technical skills and soft skills.
                                                     companiesDetails (array): All the companies the candidate worked with including internships. Array should start with the latest.
                                                     1)	name:(string) name of the company . If nothing, return "".
                                                     2)	startDate: (string) start date in this format month/year If nothing, return "".
                                                     3)	endDate: (string) end date or if no end date, present is Jan 2023. Use this format for output month/year If nothing, return "".
                                                     4)	noOfYears: (decimal) Number of employment years in the company. Else return 0.0. If start date is empty, then is 0\s
                                                     yearsOfExperience (number): Total employment in years including internship based on the information in companiesDetails (array). Convert all the months to years. Return only the total value only. Verify by adding up all the noOfYears from companiesDetails array.
                                                     1)Exclude education and trainings.\s
                                                     2) If candidate mention only present date without start date, then calculate years based on the last working date to present.
                                                     3) If candidate mention start date to present date, then calculate years based on the start date to present date.
                                                     4) Present year is 2023.
                                                     5) Employment dates for each position mentioned in your career history. Include the month and year for both the start and end dates of each job.
                                                     If any positions have unspecified employment dates, please mention that explicitly. Based on these, calculate the number of employment years of the candidate.
                                                     6) Please return number of years. Not months.
                                                     7) Always use candidate stated start date to end date first.
                                                     8) present always refer to end date.
                                                     companies (array): The names of the recent 3 companies the candidate has worked for.
                                                     
                                                     Please return only the JSON format. Please do not return any other strings. Ensure that the JSON format is valid and complete according to the above requirements.The following is a chunk of a CV.
                                                     Complete the response before returning the response.
                    """;

    private final String GPTPROMPT3_3BK =
            """
                    Please help me extract the following fields from each CV and use the followings as the keys:\s
                                                     name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase.\s
                                                     email (string): The email address of the candidate.\s
                                                     mobile (string): The mobile number of the candidate.\s
                                                     skills (array): The skills possessed by the candidate. Just technical skills, and no linguistic languages.
                                                     companiesDetails (array): All the companies the candidate worked with including internships. Array should start with the latest.
                                                     1)	name:(string) name of the company . If nothing, return "".
                                                     2)	startDate: (string) start date in this format "month/year" If nothing, return "". 
                                                     3)	endDate: (string) end date. Use this format for output "month/year". Present date is jun 2023. If there is no end date, you can determine if end date should be present date based on the resume or just till the end of year of start date.
                                                     4)	noOfYears: (decimal) Number of employment years in the company. Else return 0.0. If start date is empty, then is 0. If there is only start date, then take take it as 1 year.
                                                     yearsOfExperience (number): Total employment in years including internship based on the information in companiesDetails (array). Convert all the months to years. Return only the total value only. Verify by adding up all the noOfYears from companiesDetails array.
                                                     1)Exclude education and trainings.\s
                                                     2) If candidate mention only present date without start date, then calculate years based on the last working date to present.
                                                     3) If candidate mention start date to present date, then calculate years based on the start date to present date.
                                                     4) Present year is 2023.
                                                     5) Employment dates for each position mentioned in your career history. Include the month and year for both the start and end dates of each job.
                                                     If any positions have unspecified employment dates, please mention that explicitly. Based on these, calculate the number of employment years of the candidate.
                                                     6) Please return number of years. Not months.
                                                     7) Always use candidate stated start date to end date first.
                                                     8) present always refer to end date.
                                                     companies (array): The names of the recent 3 companies the candidate has worked for. Do not return duplicate companies.
                                                     education (string): Give me the candidate highest education qualification in the resume.
                                                     
                                                     Please return only the JSON format. Please do not return any other strings. Ensure that the JSON format is valid and complete according to the above requirements.The following is a chunk of a CV.
                                                     Complete the response before returning the response.
                    """;

    private final String GPTPROMPT3_4BK =
            """
                    Please help me extract the following fields from each CV and use the followings as the keys:\s
                                                     name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase.\s
                                                     email (string): The email address of the candidate.\s
                                                     mobile (string): The mobile number of the candidate.\s
                                                     skills (array): The skills possessed by the candidate. Just technical skills and software skills, no linguistic languages.
                                                     companiesDetails (array): All the companies the candidate worked with including internships. Array should start with the latest.
                                                     1)	name:(string) name of the company . If nothing, return "".
                                                     2)	startDate: (string) start date of employment typically in the format "month/year", if nothing, just use end date of previous job.
                                                     3)	endDate: (string) end date. Use this format for output "month/year". If no end date, just use 2023-06, present == 2023-06
                                                     4)	noOfYears: (decimal) Number of employment years in the company. Else return 0.0. If start date is empty, then is 0. If there is only start date, then take take it as 1 year.
                                                     yearsOfExperience (number): Total employment in years including internship based on the information in companiesDetails (array). Convert all the months to years. Return only the total value only, but if there are overlapping months, do not double count. Verify by adding up all the noOfYears from companiesDetails array.
                                                     1)Exclude education and trainings.\s
                                                     2) If candidate mention only present date without start date, then calculate years based on the last working date to present.
                                                     3) If candidate mention start date to present date, then calculate years based on the start date to present date.
                                                     4) Present year is 2023.
                                                     5) Employment dates for each position mentioned in your career history. Include the month and year for both the start and end dates of each job.
                                                     If any positions have unspecified employment dates, please mention that explicitly. Based on these, calculate the number of employment years of the candidate.
                                                     6) Please return number of years. Not months.
                                                     7) Always use candidate stated start date to end date first.
                                                     8) present always refer to end date.
                                                     companies (array): The names of the recent 3 companies the candidate has worked for. Do not return duplicate companies.
                                                     education (string): Give me the candidate highest education qualification in the resume.
                                                     
                                                     Please return only the JSON format. Please do not return any other strings. Ensure that the JSON format is valid and complete according to the above requirements.The following is a chunk of a CV.
                                                     Complete the response before returning the response.
                    """;


    // With Firebase
//    public ResumeService(UserRepository userRepository, ResumeRepository resumeRepository, SkillRepository skillRepository, CompanyRepository companyRepository, FirebaseStorageService firebaseStorageService, RestTemplate restTemplate) {
//        this.userRepository = userRepository;
//        this.resumeRepository = resumeRepository;
//        this.skillRepository = skillRepository;
//        this.companyRepository = companyRepository;
//        this.firebaseStorageService = firebaseStorageService;
//        this.restTemplate = restTemplate;
//    }

    // No Firebase
    public ResumeService(UserRepository userRepository, ResumeRepository resumeRepository, SkillRepository skillRepository, CompanyRepository companyRepository, RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.skillRepository = skillRepository;
        this.companyRepository = companyRepository;
        this.restTemplate = restTemplate;
    }

    public AdminResumesResponseDTO getAllResumes(int page, int size) {
        PageRequest pageable = PageRequest.of(page - 1, size);
        Page resumeList = resumeRepository.findAllWithPage(pageable);

        List<ResumeCreateResponseDTO> resumeListResponse = mapToResumeCreateResponseDTOList(resumeList.getContent());
        AdminResumesResponseDTO adminResumeResponse = new AdminResumesResponseDTO(resumeList.getTotalPages(), page, resumeListResponse);
        return adminResumeResponse;
    }

    public AdminResumesResponseDTO getAllResumesWithSearch(int page, int size, String keywords) {
        PageRequest pageable = PageRequest.of(page - 1, size);
        System.out.println("Check keyword again: " + keywords);
        Page resumeList = resumeRepository.findAllWithSearchPage(keywords, pageable);
        System.out.println(resumeList.getContent());
        List<ResumeCreateResponseDTO> resumeListResponse = mapToResumeCreateResponseDTOList(resumeList.getContent());
        AdminResumesResponseDTO adminResumeResponse = new AdminResumesResponseDTO(resumeList.getTotalPages(), page, resumeListResponse);
        return adminResumeResponse;
    }

//    public ResumeUpdateResponseDTO getResume(long UserId, long resumeId) {
//
//        Optional<User> user = userRepository.findById(UserId);
//        if (!user.isPresent()) {
//            throw new UsernameNotFoundException("User not found");
//        }
//        Optional<Resume> resume = resumeRepository.findById(resumeId);
//        if (!resume.isPresent()) {
//            throw new ResourceNotFoundException("Resume not found");
//        }
//
//        if(!checkIsAdmin()){
//            checkResumeBelongToUser(resume.get());
//        }
//
//        return resumeToResumeUpdateResponseDTO(resume.get());
//    }

    public ResumeCreateResponseDTO getResume(long UserId, long resumeId) {

        Optional<User> user = userRepository.findById(UserId);
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }
        Optional<Resume> resume = resumeRepository.findById(resumeId);
        if (!resume.isPresent()) {
            throw new ResourceNotFoundException("Resume not found");
        }

        if (!checkIsAdmin()) {
            checkResumeBelongToUser(resume.get());
        }

        return chatGPTResponseToResumeCreateResponse(resume.get());
    }

    public List<ResumeCreateResponseDTO> getResumesByUserId(long id) {
        Optional<User> user = userRepository.findById(id);
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }
        List<Resume> resumeList = resumeRepository.findByUser(user.get());
        return mapToResumeCreateResponseDTOList(resumeList);
    }

    public ResumeCreateResponseDTO resumeTest(ResumeCreateRequestDTO resumeCreateRequest) {

        if (!FileUtil.checkFileIsDocument(resumeCreateRequest.file().getOriginalFilename())) {
            throw new UploadFileException("Incorrect file extension");
        }

        Principal principal = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findByEmail(principal.getName());
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }


        StringBuilder sb = new StringBuilder();
        String extractText = extractTextFromFile(resumeCreateRequest.file());
//        System.out.println( GPTUtil.countTokens(extractText));
//        System.out.println(GPTUtil.countTokens(GPTUtil.truncateString(extractText,3000)));
//        System.out.println(GPTUtil.truncateString(extractText,3500));
        System.out.println("Splitting chunk now....");
        List<String> chunks = GPTUtil.splitTextToChunks(extractText.split("\n"), 2000);
        System.out.println("Total Chunks: " + chunks.size());
        chunks.stream().forEach(textC -> {
            System.out.println(textC);
            System.out.println("========================= Break =======================");
        });

        // Let OpenAI do the work
        List<Resume> resumeDataset = new ArrayList<>();
        List<String> storedResponses = new ArrayList<>();
        int index = 0;
        for (String chunk : chunks) {
            System.out.println("Calling ChatGPT.......");
            StringBuilder sbTemp = new StringBuilder();
            if (index == 0) {
                sbTemp.append(ChatGPTPrompt.GPTPROMPT3);
            } else {
                sbTemp.append(storedResponses.get(index - 1));
                sbTemp.append(ChatGPTPrompt.GPTPROMPT3_2);
                sbTemp.append(ChatGPTPrompt.GPTPROMPT3);
            }
            sbTemp.append(chunk);
            System.out.println("Show CHATGPT INPUT: ");
            System.out.println(sbTemp.toString());
            ChatGPTRequestDTO request = new ChatGPTRequestDTO(chatModel, sbTemp.toString(), chatGPTTemperature);
            ChatGPTResponseDTO chatGPTResponse = restTemplate.postForObject(openAiUrl, request, ChatGPTResponseDTO.class);
            String jsonOutput = chatGPTResponse.getChoices().get(0).getMessage().getContent();
            System.out.println("Show CHATGPT MESSAGE: ");
            System.out.println(jsonOutput);
            storedResponses.add(jsonOutput);
            //////////
//            Resume resume = chatGPTResponseToResume(jsonOutput);
//            resume.setFileName(resumeCreateRequest.fileName());
//            resumeDataset.add(resume);
//            System.out.println("*********************************");
//            System.out.println(resume);
            index++;
        }

//        resumeDataset.stream().forEach(resume -> {
//            System.out.println(resume);
//            System.out.println("========================= Break =======================");
//        });
        String fileExt = FileUtil.getFileExtension(resumeCreateRequest.file().getOriginalFilename());
//        String fileUrl = firebaseStorageService.uploadFile(resumeCreateRequest.file(), resumeCreateRequest.fileName(), fileExt);

        Resume resume = chatGPTResponseToResume(storedResponses.get(storedResponses.size() - 1));
        resume.setFileName(resumeCreateRequest.fileName());
//        resume.setResumeStorageRef(fileUrl);
        Resume savedResume = resumeRepository.save(resume);
        user.get().addResume(savedResume);
        user.get().setResumeLimit(user.get().getResumeLimit() + 1);
        User savedUser = userRepository.save(user.get());
//        System.out.println(savedResume.getCompanies().get(0).getName());


        return chatGPTResponseToResumeCreateResponse(savedResume);
    }

    // Use Multithreading
    public void resumesListParse(ResumeListCreateRequestDTO resumeCreateRequest) {
        Principal principal = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findByEmail(principal.getName());
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }
        ExecutorService executorService = Executors.newFixedThreadPool(NUM_THREADS);
        List<Future<String>> futures = new ArrayList<>();

        // With firebase
//        for (MultipartFile file : resumeCreateRequest.getFileList()) {
//            Callable<String> callable = new ChatGPTCallable(userRepository, resumeRepository, firebaseStorageService, restTemplate, file, user);
//            Future<String> future = executorService.submit(callable);
//            futures.add(future);
//        }

        // No Firebase
        for (MultipartFile file : resumeCreateRequest.getFileList()) {
            Callable<String> callable = new ChatGPTCallable(userRepository, resumeRepository, restTemplate, file, user);
            Future<String> future = executorService.submit(callable);
            futures.add(future);
        }

        List<String> responses = new ArrayList<>();

        for (Future<String> future : futures) {
            try {
                responses.add(future.get()); // This will block until the response is available
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } catch (ExecutionException e) {
                throw new RuntimeException(e);
            }
        }

        executorService.shutdown();
        System.out.println("Done resumes parsing with multithreading");
    }


    public ResumeCreateResponseDTO parseAndCreateResume(ResumeCreateRequestDTO resumeCreateRequest) {

        if (!FileUtil.checkFileIsDocument(resumeCreateRequest.file().getOriginalFilename())) {
            throw new UploadFileException("Incorrect file extension");
        }

        Principal principal = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findByEmail(principal.getName());
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }

        StringBuilder sb = new StringBuilder();
        String extractText = extractTextFromFile(resumeCreateRequest.file());
        sb.append(GPTPROMPT3);
        sb.append("\n");
        if (GPTUtil.countTokens(extractText) > 2700) {
            System.out.println("Truncating...");
            sb.append(GPTUtil.truncateString(extractText, 2700));
        } else {
            sb.append(extractText);
        }
        ChatGPTRequestDTO request = new ChatGPTRequestDTO(chatModel, sb.toString(), chatGPTTemperature);
//        System.out.println(chatModel);
//        System.out.println(openAiUrl);
//        System.out.println(sb.toString());
        ChatGPTResponseDTO chatGPTResponse = restTemplate.postForObject(openAiUrl, request, ChatGPTResponseDTO.class);
        String jsonOutput = chatGPTResponse.getChoices().get(0).getMessage().getContent();
//        System.out.println(jsonOutput);

        Resume resume = chatGPTResponseToResume(jsonOutput);
        resume.setFileName(resumeCreateRequest.fileName());

        Resume savedResume = resumeRepository.save(resume);
        user.get().addResume(savedResume);
        User savedUser = userRepository.save(user.get());
        System.out.println(savedResume.getCompanies().get(0).getName());

        System.out.println(savedResume);

        return chatGPTResponseToResumeCreateResponse(savedResume);
    }

    @Transactional
    public ResumeUpdateResponseDTO updateResume(ResumeUpdateRequestDTO resumeUpdateRequest) {
        Optional<Resume> resumeUpdated = resumeRepository.findById(resumeUpdateRequest.id());
        if (!resumeUpdated.isPresent()) {
            throw new ResourceNotFoundException("Resource not found");
        }

        resumeUpdated.get().setFileName(resumeUpdateRequest.fileName());
        resumeUpdated.get().setName(resumeUpdateRequest.name());
        resumeUpdated.get().setEmail(resumeUpdateRequest.email());
        resumeUpdated.get().setMobile(resumeUpdateRequest.mobile());
        resumeUpdated.get().setEducation(resumeUpdateRequest.education());
        resumeUpdated.get().setYearsOfExperience(resumeUpdateRequest.yearsOfExperience());
        resumeUpdated.get().setCompaniesDetails(resumeUpdateRequest.companiesDetails());
        // Updated field 12072023
        resumeUpdated.get().setFirstName(resumeUpdateRequest.firstName());
        resumeUpdated.get().setLastName(resumeUpdateRequest.lastName());
        resumeUpdated.get().setGender(resumeUpdateRequest.gender());
        resumeUpdated.get().setNationality(resumeUpdateRequest.nationality());
        resumeUpdated.get().setCurrentLocation(resumeUpdateRequest.location());
        resumeUpdated.get().setProfile(resumeUpdateRequest.profile());
        resumeUpdated.get().setJobTitle(resumeUpdateRequest.jobTitle());
        resumeUpdated.get().setPrimarySkills(resumeUpdateRequest.primarySkills());
        resumeUpdated.get().setSecondarySkills(resumeUpdateRequest.secondarySkills());
        resumeUpdated.get().setSpokenLanguages(resumeUpdateRequest.spokenLanguages());
        resumeUpdated.get().setEducationDetails(resumeUpdateRequest.educationDetails());

        // Update Skills & Companies
        resumeUpdated.get().getSkills().clear();
        resumeUpdated.get().getCompanies().clear();
        skillRepository.deleteByResumeId(resumeUpdateRequest.id());
        companyRepository.deleteByResumeId(resumeUpdateRequest.id());

        for (String skill : resumeUpdateRequest.skills()) {
            resumeUpdated.get().addSkill(new Skill(skill));
        }

        for (String company : resumeUpdateRequest.companies()) {
            resumeUpdated.get().addCompany(new Company(company));
        }

        Resume savedResume = resumeRepository.save(resumeUpdated.get());

        System.out.println("Updated Resume");

        return resumeToResumeUpdateResponseDTO(savedResume);
    }

    public void deleteResume(long id) {
        Principal principal = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findByEmail(principal.getName());
        Optional<Resume> resume = resumeRepository.findById(id);

        if (!resume.isPresent()) {
            throw new ResourceNotFoundException("Resource not found");
        }

        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }

        String fbFileId = resume.get().getResumeStorageRef();

        System.out.println("deleting.....");
        user.get().getResumes().remove(resume.get());
        user.get().setResumeLimit(user.get().getResumeLimit() - 1);
        userRepository.save(user.get());
        resumeRepository.delete(resume.get());

//        firebaseStorageService.deleteFile(fbFileId);

        System.out.println("Deleted from file from fb");
    }

    public void deleteUserResume(long userId, long resumeId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Resume> resume = resumeRepository.findById(resumeId);

        if (!resume.isPresent()) {
            throw new ResourceNotFoundException("Resource not found");
        }

        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }

        System.out.println("deleting.....");
        user.get().getResumes().remove(resume.get());
        user.get().setResumeLimit(user.get().getResumeLimit() - 1);
        userRepository.save(user.get());
        resumeRepository.delete(resume.get());
    }


    private String extractTextFromFile(MultipartFile file) {
        try {
            // Create an instance of AutoDetectParser
            Parser parser = new AutoDetectParser();

            // Create a handler to store the extracted content
            BodyContentHandler handler = new BodyContentHandler();

            Metadata metadata = new Metadata();

            // Create a context to hold parsing configuration
            ParseContext context = new ParseContext();

            // Parse the file and extract the content
            parser.parse(file.getInputStream(), handler, metadata, context);
//            System.out.println(handler.toString());
            // Return the extracted text content
            return handler.toString();
        } catch (Exception e) {
            // Handle any exceptions
            e.printStackTrace();
            // Return an error message or throw an exception
            return null;
        }
    }

    private ResumeCreateResponseDTO chatGPTResponseToResumeCreateResponse(Resume resume) {

        List<String> skills = resume.getSkills().stream().map(Skill::getName).toList();
        List<String> companies = resume.getCompanies().stream().map(Company::getName).toList();

        return new ResumeCreateResponseDTO(
                resume.getId(),
                resume.getFileName(),
                resume.getName(),
                resume.getEmail(),
                resume.getMobile(),
                resume.getYearsOfExperience(),
                skills,
                companies,
                resume.getEducation(),
                resume.getCompaniesDetails(),
                resume.getResumeStorageRef(),
                resume.getCreatedAt(),
                resume.getUpdatedAt(),
                userToUserResponseDTO(resume.getUser()),
                // Updated 12072023
                resume.getFirstName(),
                resume.getLastName(),
                resume.getGender(),
                resume.getCurrentLocation(),
                resume.getNationality(),
                resume.getJobTitle(),
                resume.getSpokenLanguages(),
                resume.getPrimarySkills(),
                resume.getSecondarySkills(),
                resume.getProfile(),
                resume.getEducationDetails()
        );
    }

    private ResumeUpdateResponseDTO resumeToResumeUpdateResponseDTO(Resume resume) {

        List<String> skills = resume.getSkills().stream().map(Skill::getName).toList();
        List<String> companies = resume.getCompanies().stream().map(Company::getName).toList();

        return new ResumeUpdateResponseDTO(
                resume.getId(),
                resume.getFileName(),
                resume.getName(),
                resume.getEmail(),
                resume.getMobile(),
                resume.getYearsOfExperience(),
                resume.getEducation(),
                resume.getCompaniesDetails(),
                resume.getResumeStorageRef(),
                skills,
                companies,
                // Updated 12072023
                resume.getFirstName(),
                resume.getLastName(),
                resume.getGender(),
                resume.getCurrentLocation(),
                resume.getNationality(),
                resume.getJobTitle(),
                resume.getSpokenLanguages(),
                resume.getPrimarySkills(),
                resume.getSecondarySkills(),
                resume.getProfile(),
                resume.getEducationDetails()
        );
    }

    private List<ResumeCreateResponseDTO> mapToResumeCreateResponseDTOList(List<Resume> resumes) {
        return resumes.stream().map(resumeCreateResponse -> {
            List<String> skills = resumeCreateResponse.getSkills().stream().map(Skill::getName).toList();
            List<String> companies = resumeCreateResponse.getCompanies().stream().map(Company::getName).toList();
            return new ResumeCreateResponseDTO(
                    resumeCreateResponse.getId(),
                    resumeCreateResponse.getFileName(),
                    resumeCreateResponse.getName(),
                    resumeCreateResponse.getEmail(),
                    resumeCreateResponse.getMobile(),
                    resumeCreateResponse.getYearsOfExperience(),
                    skills,
                    companies,
                    resumeCreateResponse.getEducation(),
                    resumeCreateResponse.getCompaniesDetails(),
                    resumeCreateResponse.getResumeStorageRef(),
                    resumeCreateResponse.getCreatedAt(),
                    resumeCreateResponse.getUpdatedAt(),
                    userToUserResponseDTO(resumeCreateResponse.getUser()),
                    resumeCreateResponse.getFirstName(),
                    resumeCreateResponse.getLastName(),
                    resumeCreateResponse.getGender(),
                    resumeCreateResponse.getCurrentLocation(),
                    resumeCreateResponse.getNationality(),
                    resumeCreateResponse.getJobTitle(),
                    resumeCreateResponse.getSpokenLanguages(),
                    resumeCreateResponse.getPrimarySkills(),
                    resumeCreateResponse.getSecondarySkills(),
                    resumeCreateResponse.getProfile(),
                    resumeCreateResponse.getEducationDetails()
            );
        }).collect(Collectors.toList());
    }

    private Resume chatGPTResponseToResume(String jsonOutput) {
        boolean companiesManualYearsCheck = true;
        boolean educationManualTearsCheck = false;
        Resume resume = new Resume();

        ObjectMapper objectMapper = new ObjectMapper();
        ChatGPTMappedDTO chatGPTMappedResults = null;

        try {
            chatGPTMappedResults = objectMapper.readValue(jsonOutput, ChatGPTMappedDTO.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        // Display out the chatGPTMappedresult and check
//        System.out.println("name: " + chatGPTMappedResults.getName());
//        System.out.println("email: " + chatGPTMappedResults.getEmail());
//        System.out.println("mobile: " + chatGPTMappedResults.getMobile());
//        System.out.println("skills: " + Arrays.toString(chatGPTMappedResults.getSkills()));
//        System.out.println("yearOfExperiences: " + chatGPTMappedResults.getYearsOfExperience());
//        System.out.println("companies: " + Arrays.toString(chatGPTMappedResults.getCompanies()));

        // Sort companiedetails and educationdetails in Descending order
        List<CompaniesDetails> companiesDetailsList = chatGPTMappedResults.getCompaniesDetails();
        try {
            Collections.sort(companiesDetailsList, new ComparatorUtil.DescendingCompaniesDateComparator());
        } catch (Exception e) {
            companiesDetailsList = chatGPTMappedResults.getCompaniesDetails();
            System.out.println("Error in sorting companiesDetailsList");
        }

        List<EducationDetails> educationDetailsList = chatGPTMappedResults.getEducationDetails();
        System.out.println(educationDetailsList);
        try {
            Collections.sort(educationDetailsList, new ComparatorUtil.DescendingEducationDateComparator());
        } catch (Exception e) {
            educationDetailsList = chatGPTMappedResults.getEducationDetails();
            System.out.println("Error in sorting educationDetailsList");
        }


        // Create an ObjectMapper instance
        String companiesDetails;
        String primarySkills;
        String secondarySkills;
        String spokenLanguages;
        String educationDetails;
        double companiesSumYearsOfExperience = 0;

        // Check companies years
        if (companiesManualYearsCheck) {
            // Recheck companies years of experience based on start and end date **
            System.out.println("Checking companies years of experience");
            try {
                for (CompaniesDetails companiesDetail : companiesDetailsList) {
                    String startDate = companiesDetail.getStartDate();
                    String endDate = companiesDetail.getEndDate();
                    double yearsOfExperience = 0;
                    yearsOfExperience = DateUtil.calculateNoOfYears(startDate, endDate);
                    companiesDetail.setNoOfYears(yearsOfExperience);
                    companiesSumYearsOfExperience += yearsOfExperience;
                }
                companiesSumYearsOfExperience = companiesSumYearsOfExperience;
            } catch (Exception e) {
                System.out.println("Error in calculating working years of experience");
            }
        }

        // Check education Years
        if (educationManualTearsCheck) {
            try {
                // Recheck education years of experience based on start and end date **
                System.out.println("Checking education years of experience");
                double sumEducationYearsOfExperience = 0;
                for (EducationDetails educationDetail : educationDetailsList) {
                    String startDate = educationDetail.getStartDate();
                    String endDate = educationDetail.getEndDate();
                    double yearsOfExperience = 0;
                    yearsOfExperience = DateUtil.calculateNoOfYears(startDate, endDate);
                    educationDetail.setNoOfYears(yearsOfExperience);
                    sumEducationYearsOfExperience += yearsOfExperience;
                }
            } catch (Exception e) {
                System.out.println("Error in calculating education years of experience");
            }
        }

        try {
            companiesDetails = objectMapper.writeValueAsString(companiesDetailsList);
            primarySkills = objectMapper.writeValueAsString(chatGPTMappedResults.getPrimarySkills());
            secondarySkills = objectMapper.writeValueAsString(chatGPTMappedResults.getSecondarySkills());
            spokenLanguages = objectMapper.writeValueAsString(chatGPTMappedResults.getSpokenLanguages());
            educationDetails = objectMapper.writeValueAsString(educationDetailsList);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }


        resume.setCompaniesDetails(companiesDetails);
        resume.setName(chatGPTMappedResults.getName());
        resume.setEmail(chatGPTMappedResults.getEmail());
        resume.setMobile(chatGPTMappedResults.getMobile());
        resume.setEducation(chatGPTMappedResults.getEducation());
        for (String skill : chatGPTMappedResults.getSkills()) {
            resume.addSkill(new Skill(skill));
        }
        resume.setYearsOfExperience(chatGPTMappedResults.getYearsOfExperience());
        for (String company : chatGPTMappedResults.getCompanies()) {
            resume.addCompany(new Company(company));
        }

        // Updated details 12072023
        resume.setEducationDetails(educationDetails);
        resume.setPrimarySkills(primarySkills);
        resume.setSecondarySkills(secondarySkills);
        resume.setSpokenLanguages(spokenLanguages);
        resume.setFirstName(chatGPTMappedResults.getFirstName());
        resume.setLastName(chatGPTMappedResults.getLastName());
        resume.setGender(chatGPTMappedResults.getGender());
        resume.setCurrentLocation(chatGPTMappedResults.getCurrentLocation());
        resume.setNationality(chatGPTMappedResults.getNationality());
        resume.setJobTitle(chatGPTMappedResults.getJobTitle());
        resume.setProfile(chatGPTMappedResults.getProfile());


        // Overwrite values **
        if (companiesManualYearsCheck) {
            resume.setYearsOfExperience(companiesSumYearsOfExperience);
        }

        return resume;
    }

    private UserResponseDTO userToUserResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getResumeLimit(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    private boolean checkIsAdmin() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"));
    }

    public void checkResumeBelongToUser(Resume resume) {
        Principal principal = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findByEmail(principal.getName());
        if (resume.getUser().getId() != user.get().getId()) {
            throw new ResourceAccessDeniedException("Access denied to resource");
        }
    }

    static class DescendingCompaniesDateComparator implements Comparator<CompaniesDetails> {
        @Override
        public int compare(CompaniesDetails obj1, CompaniesDetails obj2) {
            String[] parts1 = obj1.getEndDate().split("/");
            String[] parts2 = obj2.getEndDate().split("/");

            int month1 = Integer.parseInt(parts1[0]);
            int year1 = Integer.parseInt(parts1[1]);
            int month2 = Integer.parseInt(parts2[0]);
            int year2 = Integer.parseInt(parts2[1]);

            if (year1 != year2) {
                return Integer.compare(year2, year1); // Compare years in descending order
            } else {
                return Integer.compare(month2, month1); // If years are equal, compare months in descending order
            }
        }
    }

    static class DescendingEducationDateComparator implements Comparator<EducationDetails> {
        @Override
        public int compare(EducationDetails obj1, EducationDetails obj2) {
            String[] parts1 = obj1.getEndDate().split("/");
            String[] parts2 = obj2.getEndDate().split("/");

            int month1 = Integer.parseInt(parts1[0]);
            int year1 = Integer.parseInt(parts1[1]);
            int month2 = Integer.parseInt(parts2[0]);
            int year2 = Integer.parseInt(parts2[1]);

            if (year1 != year2) {
                return Integer.compare(year2, year1); // Compare years in descending order
            } else {
                return Integer.compare(month2, month1); // If years are equal, compare months in descending order
            }
        }
    }

}
