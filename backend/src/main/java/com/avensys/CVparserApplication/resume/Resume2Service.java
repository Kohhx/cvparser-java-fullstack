package com.avensys.CVparserApplication.resume;

import com.avensys.CVparserApplication.company.CompanyRepository;
import com.avensys.CVparserApplication.firebase.FirebaseStorageService;
import com.avensys.CVparserApplication.openai.ChatGPTPrompt;
import com.avensys.CVparserApplication.openai.ChatGPTRequestDTO;
import com.avensys.CVparserApplication.openai.ChatGPTResponseDTO;
import com.avensys.CVparserApplication.openai.ChatGPTResumePrompt;
import com.avensys.CVparserApplication.skill.SkillRepository;
import com.avensys.CVparserApplication.user.User;
import com.avensys.CVparserApplication.user.UserRepository;
import com.avensys.CVparserApplication.utility.FileUtil;
import com.avensys.CVparserApplication.utility.GPTUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class Resume2Service {
    public final UserRepository userRepository;
    public final ResumeRepository resumeRepository;
    public final SkillRepository skillRepository;
    public final CompanyRepository companyRepository;
    public final FirebaseStorageService firebaseStorageService;
    public final RestTemplate restTemplate;
    public final double chatGPTTemperature = 0.7;
//    private static final int NUM_THREADS = 10;

    @Value("${openai.model}")
    private String chatModel;

    @Value("${openai.api.url}")
    private String openAiUrl;
    private String extractText;

    public Resume2Service(UserRepository userRepository, ResumeRepository resumeRepository, SkillRepository skillRepository, CompanyRepository companyRepository, FirebaseStorageService firebaseStorageService, RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.skillRepository = skillRepository;
        this.companyRepository = companyRepository;
        this.firebaseStorageService = firebaseStorageService;
        this.restTemplate = restTemplate;
    }

    public void parseResume(ResumeCreateRequestDTO resumeCreateRequest) {
        Principal principal = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userRepository.findByEmail(principal.getName());
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }

        StringBuilder sb = new StringBuilder();

        // Extract text from file
        String extractText = FileUtil.parseFileToString(resumeCreateRequest.file());

        // Split text into chunks
        System.out.println("Splitting chunk now....");
        List<String> chunks = GPTUtil.splitTextToChunks(extractText.split("\n"), 2000);
        System.out.println("Total Chunks: " + chunks.size());

//        List<Resume> skillDataset = new ArrayList<>();
        List<String> storedSkillResponses = new ArrayList<>();
        int index = 0;
        for (String chunk : chunks) {
            System.out.println("Calling ChatGPT.......");
            StringBuilder sbTemp = new StringBuilder();
            if (index == 0) {
                sbTemp.append(ChatGPTResumePrompt.initialPrompt);
                sbTemp.append(ChatGPTResumePrompt.skillsPrompt);
                sbTemp.append(ChatGPTResumePrompt.endPrompt);
            } else {
                sbTemp.append(storedSkillResponses.get(index - 1));
                sbTemp.append(ChatGPTResumePrompt.continuePrompt);
                sbTemp.append(ChatGPTResumePrompt.initialPrompt);
                sbTemp.append(ChatGPTResumePrompt.skillsPrompt);
                sbTemp.append(ChatGPTResumePrompt.endPrompt);
            }
            sbTemp.append(chunk);
            System.out.println("Show CHATGPT INPUT: ");
            System.out.println(sbTemp.toString());
            ChatGPTRequestDTO request = new ChatGPTRequestDTO(chatModel, sbTemp.toString(), chatGPTTemperature);
            ChatGPTResponseDTO chatGPTResponse = restTemplate.postForObject(openAiUrl, request, ChatGPTResponseDTO.class);
            String jsonOutput = chatGPTResponse.getChoices().get(0).getMessage().getContent();
            System.out.println("Show CHATGPT MESSAGE: ");
            System.out.println(jsonOutput);
            storedSkillResponses.add(jsonOutput);
    }
}
