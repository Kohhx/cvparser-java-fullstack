package com.avensys.CVparserApplication.resume;

import com.avensys.CVparserApplication.company.Company;
import com.avensys.CVparserApplication.company.CompanyRepository;
import com.avensys.CVparserApplication.openai.*;
import com.avensys.CVparserApplication.skill.Skill;
import com.avensys.CVparserApplication.skill.SkillRepository;
import com.avensys.CVparserApplication.user.User;
import com.avensys.CVparserApplication.user.UserRepository;
import com.avensys.CVparserApplication.user.UserResponseDTO;
import com.avensys.CVparserApplication.utility.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class Resume2Service {
    public final UserRepository userRepository;
    public final ResumeRepository resumeRepository;
    public final SkillRepository skillRepository;
    public final CompanyRepository companyRepository;
    //    public final FirebaseStorageService firebaseStorageService;
    public final RestTemplate restTemplate;
    public final double chatGPTTemperature = 0.7;
//    private static final int NUM_THREADS = 10;

    @Value("${openai.model}")
    private String chatModel;

    @Value("${openai.api.url}")
    private String openAiUrl;
    private String extractText;

    //With Firebase
//    public Resume2Service(UserRepository userRepository, ResumeRepository resumeRepository, SkillRepository skillRepository, CompanyRepository companyRepository, FirebaseStorageService firebaseStorageService, RestTemplate restTemplate) {
//        this.userRepository = userRepository;
//        this.resumeRepository = resumeRepository;
//        this.skillRepository = skillRepository;
//        this.companyRepository = companyRepository;
//        this.firebaseStorageService = firebaseStorageService;
//        this.restTemplate = restTemplate;
//    }

    //No Firebase
    public Resume2Service(UserRepository userRepository, ResumeRepository resumeRepository, SkillRepository skillRepository, CompanyRepository companyRepository, RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.skillRepository = skillRepository;
        this.companyRepository = companyRepository;
        this.restTemplate = restTemplate;
    }

//    public void parseResume(ResumeCreateRequestDTO resumeCreateRequest) {
//        Principal principal = SecurityContextHolder.getContext().getAuthentication();
//        Optional<User> user = userRepository.findByEmail(principal.getName());
//        if (!user.isPresent()) {
//            throw new UsernameNotFoundException("User not found");
//        }
//
////        StringBuilder sb = new StringBuilder();
//
//        // Extract text from file
//        String extractText = FileUtil.parseFileToString(resumeCreateRequest.file());
//
//        // Split text into chunks
//        System.out.println("Splitting chunk now....");
//        List<String> chunks = GPTUtil.splitTextToChunks(extractText.split("\n"), 2000);
//        System.out.println("Total Chunks: " + chunks.size());
//
////        List<Resume> skillDataset = new ArrayList<>();
//        List<String> storedSkillResponses = new ArrayList<>();
//        List<String> storedCompaniesResponses = new ArrayList<>();
//        int index = 0;
//        for (String chunk : chunks) {
////            System.out.println("Displaying Chunk " + index + ": " + chunk);
//
//            String JSONSkills = parseSection(chunk, ChatGPTResumePrompt.skillsPrompt, index, storedSkillResponses);
//            storedSkillResponses.add(JSONSkills);
//
//            String JSONCompanies = parseSection(chunk, ChatGPTResumePrompt.companiesPrompt, index, storedCompaniesResponses);
//            storedCompaniesResponses.add(JSONCompanies);
//
//            index++;
//        }
//        System.out.println("Show Skills JSON: ");
//        System.out.println(storedSkillResponses.get(storedSkillResponses.size() - 1));
//
//        System.out.println("Show Companies JSON: ");
//        System.out.println(storedCompaniesResponses.get(storedCompaniesResponses.size() - 1));
//
//        String JSON = JSONUtil.mergeJsonObjects(storedSkillResponses.get(storedSkillResponses.size() - 1), storedCompaniesResponses.get(storedCompaniesResponses.size() - 1));
//        System.out.println("Show JSON: ");
//        System.out.println(JSON);
//    }

    public ResumeCreateResponseDTO parseResumeConcurrent(ResumeCreateRequestDTO resumeCreateRequest) {
        Principal principal = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findByEmail(principal.getName());
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }
        return parseSingleResumeAndSave(resumeCreateRequest.file(), resumeCreateRequest.fileName(), user);
    }

    public void parseResumeConcurrentList(ResumeListCreateRequestDTO resumeCreateRequest) {
        int NUM_THREADS = resumeCreateRequest.getFileList().size();
        System.out.println("NUM_THREADS: " + NUM_THREADS);
        Principal principal = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findByEmail(principal.getName());
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }

        ExecutorService executorService = Executors.newFixedThreadPool(NUM_THREADS);
        List<Future<ResumeCreateResponseDTO>> futures = new ArrayList<>();
        for (MultipartFile file : resumeCreateRequest.getFileList()) {
            Future<ResumeCreateResponseDTO> future = executorService.submit(() -> {
                return parseSingleResumeAndSave(file, file.getOriginalFilename(), user);
            });
            futures.add(future);
        }

        List<ResumeCreateResponseDTO> responses = new ArrayList<>();

        for (Future<ResumeCreateResponseDTO> future : futures) {
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

    private String parseSection(String chunk, String promptSection, List<String> responses) {
        System.out.println("Calling ChatGPT.......");
        int index = responses.size();
        StringBuilder sbTemp = new StringBuilder();
        if (index == 0) {
            sbTemp.append(ChatGPTResumePrompt.initialPrompt);
            sbTemp.append(promptSection);
            sbTemp.append(ChatGPTResumePrompt.endPrompt);

        } else {
            sbTemp.append(responses.get(index - 1));
            System.out.println("Show previous response: " + responses.get(index - 1));
            sbTemp.append(ChatGPTResumePrompt.continuePrompt);
            sbTemp.append(ChatGPTResumePrompt.initialPrompt);
            sbTemp.append(promptSection);
            sbTemp.append(ChatGPTResumePrompt.endPrompt);
        }
        sbTemp.append(chunk);
//            System.out.println("Show CHATGPT INPUT: ");
//            System.out.println(sbTemp.toString());
        ChatGPTRequestDTO request = new ChatGPTRequestDTO(chatModel, sbTemp.toString(), chatGPTTemperature);
        ChatGPTResponseDTO chatGPTResponse = null;
        try {
            chatGPTResponse = restTemplate.postForObject(openAiUrl, request, ChatGPTResponseDTO.class);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
        String jsonOutput = chatGPTResponse.getChoices().get(0).getMessage().getContent();
//        System.out.println("Show CHATGPT MESSAGE: ");
//        System.out.println(jsonOutput);
//        responses.add(jsonOutput);
        return jsonOutput;
    }

    //========================================================================================

    private ResumeCreateResponseDTO parseSingleResumeAndSave(MultipartFile file, String fileName, Optional<User> user) {
        // Extract text from file
        String extractText = FileUtil.parseFileToString(file);

        // Split text into chunks
        System.out.println("Splitting chunk now....");
        List<String> chunks = GPTUtil.splitTextToChunks(extractText.split("\n"), 2000);
        System.out.println("Total Chunks: " + chunks.size());

        // Declare arraylist to store data if more than 1 chunk
        List<String> storedBiosResponses = new ArrayList<>();
        List<String> storedSkillResponses = new ArrayList<>();
        List<String> storedCompaniesResponses = new ArrayList<>();
        List<String> storedEducationResponses = new ArrayList<>();

        //Set up thread pool
        ExecutorService innerExecutor = Executors.newFixedThreadPool(4);
        Future<String> biosFuture = null;
        Future<String> skillsFuture = null;
        Future<String> companiesFuture = null;
        Future<String> educationFuture = null;

        List<Future<String>> futures = new ArrayList<>();
        for (String chunk : chunks) {

            biosFuture = innerExecutor.submit(() -> {
                System.out.println("Parsing Bio");
                System.out.println("biosStoredResponses size: " + storedBiosResponses.size());
                String JSONBio = parseSection(chunk, ChatGPTResumePrompt.bioPrompt, storedBiosResponses);
                return JSONBio;
            });


            skillsFuture = innerExecutor.submit(() -> {
                System.out.println("Parsing skills");
                System.out.println("skillsStoredResponses size: " + storedSkillResponses.size());
                String JSONSkills = parseSection(chunk, ChatGPTResumePrompt.skillsPrompt, storedSkillResponses);
                return JSONSkills;
            });


            companiesFuture = innerExecutor.submit(() -> {
                System.out.println("Parsing companies");
                System.out.println("companiesStoredResponses size: " + storedCompaniesResponses.size());
                String JSONCompanies = parseSection(chunk, ChatGPTResumePrompt.companiesPrompt, storedCompaniesResponses);
                return JSONCompanies;
            });


            educationFuture = innerExecutor.submit(() -> {
                System.out.println("Parsing education");
                System.out.println("educationStoredResponses size: " + storedEducationResponses.size());
                String JSONEducation = parseSection(chunk, ChatGPTResumePrompt.educationPrompt, storedEducationResponses);
                return JSONEducation;
            });

            futures.add(skillsFuture);
            futures.add(companiesFuture);
            futures.add(biosFuture);
            futures.add(educationFuture);
            try {
                storedCompaniesResponses.add(companiesFuture.get());
                storedSkillResponses.add(skillsFuture.get());
                storedBiosResponses.add(biosFuture.get());
                storedEducationResponses.add(educationFuture.get());
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } catch (ExecutionException e) {
                throw new RuntimeException(e);
            }

        }

        // Wait for all tasks to complete
        for (Future<String> future : futures) {
            try {
                String result = future.get();
                // Handle the result if needed
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // Declare all sub json String
        String skillsJSONFinal = "";
        String companiesJSONFinal = "";
        String biosJSONFinal = "";
        String educationJSONFinal = "";

//        System.out.println("Show Companies JSON: ");
        try {
            System.out.println("Show Final bios JSON: ");
            System.out.println(biosFuture.get());
            biosJSONFinal = biosFuture.get();

            System.out.println("Show Final skills JSON: ");
            System.out.println(skillsFuture.get());
            skillsJSONFinal = skillsFuture.get();

            System.out.println("Show Final companies JSON: ");
            System.out.println(companiesFuture.get());
            companiesJSONFinal = companiesFuture.get();


            System.out.println("Show Final education JSON: ");
            System.out.println(educationFuture.get());
            educationJSONFinal = educationFuture.get();

        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        }

        String JSON = JSONUtil.mergeJsonObjects(biosJSONFinal, skillsJSONFinal, companiesJSONFinal, educationJSONFinal);
        System.out.println("Show Merged JSON: ");
        System.out.println(JSON);
        System.out.println("End of merged JSON==================*****************************************");

        String fileExt = FileUtil.getFileExtension(file.getOriginalFilename());
//        String fileUrl = firebaseStorageService.uploadFile(file, fileName, fileExt);

        Resume resume = chatGPTResponseToResume(JSON);
        resume.setFileName(fileName);
//        resume.setResumeStorageRef(fileUrl);
        Resume savedResume = resumeRepository.save(resume);
        user.get().addResume(savedResume);
        user.get().setResumeLimit(user.get().getResumeLimit() + 1);
        User savedUser = userRepository.save(user.get());

        innerExecutor.shutdown();

        return chatGPTResponseToResumeCreateResponse(savedResume);
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


        List<CompaniesDetails> companiesDetailsList = chatGPTMappedResults.getCompaniesDetails();

        // Lets check through all the start and end date
        List<CompaniesDetails> companiesDetailsListManual = new ArrayList<>();
        for (CompaniesDetails companiesDetails : companiesDetailsList) {
            String startDate = companiesDetails.getStartDate();
            String endDate = companiesDetails.getEndDate();

            if (endDate.equals("Present") || endDate.equals("present")) {
                String monthValue = String.format("%02d", LocalDate.now().getMonthValue());
                companiesDetails.setEndDate(monthValue + "/" + LocalDate.now().getYear());
                System.out.println(LocalDate.now().getMonth() + "/" + LocalDate.now().getYear());
            }

            String yearRegex = "\\d{4}";
            Pattern pattern = Pattern.compile(yearRegex);
            Matcher matcher = pattern.matcher(startDate);
            if (matcher.matches()) {
                companiesDetails.setStartDate("01/" + startDate);
            }

            if (startDate.equals(endDate)) {
                companiesDetails.setEndDate("12/" + endDate);
            }

            companiesDetailsListManual.add(companiesDetails);

        }

        companiesDetailsList = companiesDetailsListManual;

        // Sort companiedetails and educationdetails in Descending order
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
                companiesSumYearsOfExperience = chatGPTMappedResults.getYearsOfExperience();
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
        if (companiesManualYearsCheck) {
            resume.setYearsOfExperience(companiesSumYearsOfExperience);
        } else {
            resume.setYearsOfExperience(chatGPTMappedResults.getYearsOfExperience());
        }
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
}
