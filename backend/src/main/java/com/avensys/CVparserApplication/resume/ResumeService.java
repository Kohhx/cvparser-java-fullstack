package com.avensys.CVparserApplication.resume;

import com.avensys.CVparserApplication.company.Company;
import com.avensys.CVparserApplication.company.CompanyRepository;
import com.avensys.CVparserApplication.exceptions.ResourceNotFoundException;
import com.avensys.CVparserApplication.exceptions.UploadFileException;
import com.avensys.CVparserApplication.openai.ChatGPTMappedDTO;
import com.avensys.CVparserApplication.openai.ChatGPTRequestDTO;
import com.avensys.CVparserApplication.openai.ChatGPTResponseDTO;
import com.avensys.CVparserApplication.skill.Skill;
import com.avensys.CVparserApplication.skill.SkillRepository;
import com.avensys.CVparserApplication.user.User;
import com.avensys.CVparserApplication.user.UserRepository;
import com.avensys.CVparserApplication.utility.FileUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.Arrays;
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

    @Value("${openai.model}")
    private String chatModel;

    @Value("${openai.api.url}")
    private String openAiUrl;

    public ResumeService(UserRepository userRepository, ResumeRepository resumeRepository, SkillRepository skillRepository, CompanyRepository companyRepository, RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.skillRepository = skillRepository;
        this.companyRepository = companyRepository;
        this.restTemplate = restTemplate;
    }

    public List<ResumeCreateResponseDTO> getResumesByUserId(long id) {
        Optional<User> user = userRepository.findById(id);
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }
        List<Resume> resumeList = resumeRepository.findByUser(user.get());
        return mapToResumeCreateResponseDTOList(resumeList);
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
        sb.append("""
                Please help me extract the following fields from each CV and use the followings as the keys:
                name (string): The name of the candidate. Letter of each word is capital, the rest are lowercase.
                email (string): The email address of the candidate.
                mobile (string): The mobile number of the candidate.
                skills (array): The skills possessed by the candidate.
                yearsOfExperience (number): The number of years of experience of the candidate. Please calculate the total number of year if he is working till present.
                companies (array): The names of the recent 3 companies the candidate has worked for.
                                
                Please return only the JSON format. Please do not return any other strings.
                                
                """);
        sb.append("\n");
        sb.append(extractText);
//        sb.append("""
//                Koh He Xiang
//                Email: k@gmail.com
//                """);
        ChatGPTRequestDTO request = new ChatGPTRequestDTO(chatModel, sb.toString());
        System.out.println(chatModel);
        System.out.println(openAiUrl);
        System.out.println(sb.toString());
        ChatGPTResponseDTO chatGPTResponse = restTemplate.postForObject(openAiUrl, request, ChatGPTResponseDTO.class);
        String jsonOutput = chatGPTResponse.getChoices().get(0).getMessage().getContent();
        System.out.println(jsonOutput);


        ObjectMapper objectMapper = new ObjectMapper();
        ChatGPTMappedDTO chatGPTMappedResults = null;
        try {
            chatGPTMappedResults = objectMapper.readValue(jsonOutput, ChatGPTMappedDTO.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        System.out.println("name: " + chatGPTMappedResults.getName());
        System.out.println("email: " + chatGPTMappedResults.getEmail());
        System.out.println("mobile: " + chatGPTMappedResults.getMobile());
        System.out.println("skills: " + Arrays.toString(chatGPTMappedResults.getSkills()));
        System.out.println("yearOfExperiences: " + chatGPTMappedResults.getYearsOfExperience());
        System.out.println("companies: " + Arrays.toString(chatGPTMappedResults.getCompanies()));

        Resume resume = new Resume();
        resume.setFileName(resumeCreateRequest.fileName());
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

        Resume savedResume = resumeRepository.save(resume);
        user.get().addResume(savedResume);
        User savedUser = userRepository.save(user.get());
        System.out.println(savedResume.getCompanies().get(0).getName());

        return chatGPTResponseToResumeCreateResponse(savedResume);
    }

    @Transactional
    public ResumeUpdateResponseDTO updateResume(ResumeUpdateRequestDTO resumeUpdateRequest) {
        Optional<Resume> resumeUpdated = resumeRepository.findById(resumeUpdateRequest.id());
        if (!resumeUpdated.isPresent()){
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

    public void deleteResume(long id) {
        Principal principal = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findByEmail(principal.getName());
        Optional<Resume> resume = resumeRepository.findById(id);

        if (!resume.isPresent()){
            throw new ResourceNotFoundException("Resource not found");
        }

        if (!user.isPresent()){
            throw new UsernameNotFoundException("User not found");
        }

        user.get().getResumes().remove(resume.get());
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

        private ResumeCreateResponseDTO chatGPTResponseToResumeCreateResponse(Resume resume){

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
                companies);
    }

    private ResumeUpdateResponseDTO resumeToResumeUpdateResponseDTO(Resume resume){

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

    private List<ResumeCreateResponseDTO> mapToResumeCreateResponseDTOList (List<Resume> resumes) {
        return resumes.stream().map( resumeCreateResponse -> {
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
                    companies);
        }).collect(Collectors.toList());
    }
}
