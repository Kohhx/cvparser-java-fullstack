package com.avensys.CVparserApplication.resume;

import com.avensys.CVparserApplication.company.Company;
import com.avensys.CVparserApplication.company.CompanyRepository;
import com.avensys.CVparserApplication.exceptions.ResourceAccessDeniedException;
import com.avensys.CVparserApplication.exceptions.ResourceNotFoundException;
import com.avensys.CVparserApplication.exceptions.UploadFileException;
import com.avensys.CVparserApplication.openai.ChatGPTMappedDTO;
import com.avensys.CVparserApplication.openai.ChatGPTRequestDTO;
import com.avensys.CVparserApplication.openai.ChatGPTResponseDTO;
import com.avensys.CVparserApplication.skill.Skill;
import com.avensys.CVparserApplication.skill.SkillRepository;
import com.avensys.CVparserApplication.user.User;
import com.avensys.CVparserApplication.user.UserRepository;
import com.avensys.CVparserApplication.user.UserResponseDTO;
import com.avensys.CVparserApplication.utility.FileUtil;
import com.avensys.CVparserApplication.utility.GPTUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
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

import java.io.IOException;
import java.io.StringWriter;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResumeService {
    public final UserRepository userRepository;
    public final ResumeRepository resumeRepository;
    public final SkillRepository skillRepository;
    public final CompanyRepository companyRepository;
    public final RestTemplate restTemplate;
    public final double chatGPTTemperature = 0.7;


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
                                                     email (string): The email address of the candidate.\s
                                                     mobile (string): The mobile number of the candidate.\s
                                                     skills (array): The skills possessed by the candidate. Both technical skills and soft skills.
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
                                                     companies (array): The names of the recent 3 companies the candidate has worked for.
                                                     
                                                     Please return only the JSON format. Please do not return any other strings. Ensure that the JSON format is valid and complete according to the above requirements.The following is a chunk of a CV.
                                                     Complete the response before returning the response.
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


    public ResumeService(UserRepository userRepository, ResumeRepository resumeRepository, SkillRepository skillRepository, CompanyRepository companyRepository, RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.skillRepository = skillRepository;
        this.companyRepository = companyRepository;
        this.restTemplate = restTemplate;
    }

    public AdminResumesResponseDTO getAllResumes(int page, int size) {
        PageRequest pageable = PageRequest.of(page-1, size);
        Page resumeList = resumeRepository.findAllWithPage(pageable);

        List<ResumeCreateResponseDTO> resumeListResponse = mapToResumeCreateResponseDTOList(resumeList.getContent());
        AdminResumesResponseDTO adminResumeResponse = new AdminResumesResponseDTO(resumeList.getTotalPages(), page, resumeListResponse);
        return adminResumeResponse;
    }

    public AdminResumesResponseDTO getAllResumesWithSearch(int page, int size, String keywords) {
        PageRequest pageable = PageRequest.of(page-1, size);
        System.out.println("Check keyword again: " + keywords);
        Page resumeList = resumeRepository.findAllWithSearchPage(keywords,pageable);
        System.out.println(resumeList.getContent());
        List<ResumeCreateResponseDTO> resumeListResponse = mapToResumeCreateResponseDTOList(resumeList.getContent());
        AdminResumesResponseDTO adminResumeResponse = new AdminResumesResponseDTO(resumeList.getTotalPages(), page, resumeListResponse);
        return adminResumeResponse;
    }

    public ResumeUpdateResponseDTO getResume(long UserId, long resumeId) {

        Optional<User> user = userRepository.findById(UserId);
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }
        Optional<Resume> resume = resumeRepository.findById(resumeId);
        if (!resume.isPresent()) {
            throw new ResourceNotFoundException("Resume not found");
        }

        if(!checkIsAdmin()){
            checkResumeBelongToUser(resume.get());
        }

        return resumeToResumeUpdateResponseDTO(resume.get());
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
        System.out.println("Hello World");

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
        List<String> chunks = GPTUtil.splitTextToChunks(extractText.split("\n"), 2700);
        chunks.stream().forEach(textC -> {
            System.out.println(textC);
            System.out.println("========================= Break =======================");
        });
        System.out.println("Total Chunks: " + chunks.size());

        // Let OpenAI do the work
        List<Resume> resumeDataset = new ArrayList<>();
        List<String> storedResponses = new ArrayList<>();
        int index = 0;
        for (String chunk : chunks) {
            System.out.println("Calling ChatGPT.......");
            StringBuilder sbTemp = new StringBuilder();
            if (index == 0) {
                sbTemp.append(GPTPROMPT3);
            } else {
                sbTemp.append(storedResponses.get(index - 1));
                sbTemp.append(GPTPROMPT3_2);
                sbTemp.append(GPTPROMPT3);
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

        Resume resume = chatGPTResponseToResume(storedResponses.get(storedResponses.size() - 1));
        resume.setFileName(resumeCreateRequest.fileName());
        Resume savedResume = resumeRepository.save(resume);
        user.get().addResume(savedResume);
        user.get().setResumeLimit(user.get().getResumeLimit() + 1);
        User savedUser = userRepository.save(user.get());
        System.out.println(savedResume.getCompanies().get(0).getName());


        return chatGPTResponseToResumeCreateResponse(savedResume);
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
        resumeUpdated.get().setYearsOfExperience(resumeUpdateRequest.yearsOfExperience());

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

        return resumeToResumeUpdateResponseDTO(savedResume);
    }
    
    public String exportResume(ResumeExportRequestDTO resumeExportRequest) {
    	StringWriter stringWriter = new StringWriter();
        
        try (CSVPrinter csvPrinter = new CSVPrinter(stringWriter, CSVFormat.DEFAULT)) {
        	
        	csvPrinter.printRecord("Resume Name",
        			"Email",  "Mobile", "Skills",
        			"Years of Experiences", "Companies");

            // Write data from DTO to CSV
            csvPrinter.printRecord(resumeExportRequest.name(),
            		resumeExportRequest.email(),resumeExportRequest.mobile(),resumeExportRequest.skills(),
            		resumeExportRequest.yearsOfExperience(),resumeExportRequest.companies());
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
        
        return stringWriter.toString();
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

        System.out.println("deleting.....");
        user.get().getResumes().remove(resume.get());
        user.get().setResumeLimit(user.get().getResumeLimit() - 1);
        userRepository.save(user.get());
        resumeRepository.delete(resume.get());
    }

    public void deleteUserResume(long userId,long resumeId) {
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
                resume.getCreatedAt(),
                resume.getUpdatedAt(),
                userToUserResponseDTO(resume.getUser())
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
                skills,
                companies);
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
                    resumeCreateResponse.getCreatedAt(),
                    resumeCreateResponse.getUpdatedAt(),
                    userToUserResponseDTO(resumeCreateResponse.getUser())
            );
        }).collect(Collectors.toList());
    }

    private Resume chatGPTResponseToResume(String jsonOutput) {

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

        resume.setName(chatGPTMappedResults.getName());
        resume.setEmail(chatGPTMappedResults.getEmail());
        resume.setMobile(chatGPTMappedResults.getMobile());
        for (String skill : chatGPTMappedResults.getSkills()) {
            resume.addSkill(new Skill(skill));
        }
        resume.setYearsOfExperience(chatGPTMappedResults.getYearsOfExperience());
        for (String company : chatGPTMappedResults.getCompanies()) {
            resume.addCompany(new Company(company));
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

}
