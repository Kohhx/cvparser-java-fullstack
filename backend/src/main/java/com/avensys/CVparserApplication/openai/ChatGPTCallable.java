package com.avensys.CVparserApplication.openai;

import com.avensys.CVparserApplication.company.Company;
import com.avensys.CVparserApplication.exceptions.ResourceAccessDeniedException;
import com.avensys.CVparserApplication.exceptions.UploadFileException;
import com.avensys.CVparserApplication.firebase.FirebaseStorageService;
import com.avensys.CVparserApplication.resume.*;
import com.avensys.CVparserApplication.skill.Skill;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Callable;
import java.util.stream.Collectors;


public class ChatGPTCallable implements Callable<String> {

    public boolean showMessage = false;
    public UserRepository userRepository;
    public ResumeRepository resumeRepository;
    public FirebaseStorageService firebaseStorageService;
    public RestTemplate restTemplate;
    public Optional<User> user;

    public final double chatGPTTemperature = 0.9;
    private static final int NUM_THREADS = 10;

    private String chatModel = "gpt-3.5-turbo";

    private String openAiUrl = "https://api.openai.com/v1/chat/completions";
    private String extractText;
    private final MultipartFile file;

    private final String GPTPROMPT3 =
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


    private final String GPTPROMPT3_2 =
            """
                                
                    Above is the result from previous response. Use this as the input for the next response. Add the new extracted information to this and merge them to give the final JSON output.
                           
                            """;


    public ChatGPTCallable(UserRepository userRepository, ResumeRepository resumeRepository, FirebaseStorageService firebaseStorageService, RestTemplate restTemplate, MultipartFile file, Optional<User> user) {
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.firebaseStorageService = firebaseStorageService;
        this.restTemplate = restTemplate;
        this.file = file;
        this.user = user;
    }

    @Override
    public String call() throws Exception {
        if (!FileUtil.checkFileIsDocument(file.getOriginalFilename())) {
            throw new UploadFileException("Incorrect file extension");
        }
        System.out.println("File NAMME: " + file.getOriginalFilename());
        StringBuilder sb = new StringBuilder();
        try {
            file.getInputStream();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        String extractText = extractTextFromFile(file);
        List<String> chunks = GPTUtil.splitTextToChunks(extractText.split("\n"), 2500);
        if (showMessage) {
            chunks.stream().forEach(textC -> {
                System.out.println(textC);
                System.out.println("========================= Break =======================");
            });
            System.out.println("Total Chunks: " + chunks.size());
        }
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
            if (showMessage) {
                System.out.println("Show CHATGPT INPUT: ");
                System.out.println(sbTemp.toString());
            }
            ChatGPTRequestDTO request = new ChatGPTRequestDTO(chatModel, sbTemp.toString(), chatGPTTemperature);
            ChatGPTResponseDTO chatGPTResponse = restTemplate.postForObject(openAiUrl, request, ChatGPTResponseDTO.class);
            String jsonOutput = chatGPTResponse.getChoices().get(0).getMessage().getContent();
            if (showMessage) {
                System.out.println("Show CHATGPT MESSAGE: ");
                System.out.println(jsonOutput);
            }
            storedResponses.add(jsonOutput);
            index++;
        }

        String fileExt = FileUtil.getFileExtension(file.getOriginalFilename());
        String fileUrl = firebaseStorageService.uploadFile(file, FileUtil.getFileName(file.getOriginalFilename()), fileExt);

        // Extract JSON
        String JSON = FileUtil.extractJsonFromString(storedResponses.get(storedResponses.size() - 1));
        System.out.println("My JSON");
        System.out.println(JSON);

        Resume resume = chatGPTResponseToResume(JSON);
//        Resume resume = chatGPTResponseToResume(storedResponses.get(storedResponses.size() - 1));
        resume.setFileName(FileUtil.getFileName(file.getOriginalFilename()));
        resume.setResumeStorageRef(fileUrl);
        Resume savedResume = resumeRepository.save(resume);
        user.get().addResume(savedResume);
        user.get().setResumeLimit(user.get().getResumeLimit() + 1);
        User savedUser = userRepository.save(user.get());
        return "ok";
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
        boolean manualYearsCheck = false;
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
            System.out.println("Error in sorting companiesDetailsList");
        }

        List<EducationDetails> educationDetailsList = chatGPTMappedResults.getEducationDetails();
        System.out.println(educationDetailsList);
        try {
            Collections.sort(educationDetailsList, new ComparatorUtil.DescendingEducationDateComparator());
        } catch (Exception e) {
            System.out.println("Error in sorting educationDetailsList");
        }


        // Create an ObjectMapper instance
        String companiesDetails;
        String primarySkills;
        String secondarySkills;
        String spokenLanguages;
        String educationDetails;
        double companiesSumYearsOfExperience = 0;
        try {
            if (manualYearsCheck) {
                // Recheck companies years of experience based on start and end date **
                System.out.println("Checking companies years of experience");
                for (CompaniesDetails companiesDetail : companiesDetailsList) {
                    String startDate = companiesDetail.getStartDate();
                    String endDate = companiesDetail.getEndDate();
                    double yearsOfExperience = 0;
                    try {
                        yearsOfExperience = DateUtil.calculateNoOfYears(startDate, endDate);
                    } catch (Exception e) {
                        System.out.println("Error in calculating years of experience");
                    }
                    companiesDetail.setNoOfYears(yearsOfExperience);
                    companiesSumYearsOfExperience += yearsOfExperience;
                }

//                // Recheck education years of experience based on start and end date **
//                System.out.println("Checking education years of experience");
//                double sumEducationYearsOfExperience = 0;
//                for (EducationDetails educationDetail : educationDetailsList) {
//                    String startDate = educationDetail.getStartDate();
//                    String endDate = educationDetail.getEndDate();
//                    double yearsOfExperience = 0;
//                    try {
//                        yearsOfExperience = DateUtil.calculateNoOfYears(startDate, endDate);
//                    } catch (Exception e) {
//                        System.out.println("Error in calculating years of experience");
//                    }
//                    educationDetail.setNoOfYears(yearsOfExperience);
//                    sumEducationYearsOfExperience += yearsOfExperience;
//                }
            }

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
        if (manualYearsCheck) {
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


}
