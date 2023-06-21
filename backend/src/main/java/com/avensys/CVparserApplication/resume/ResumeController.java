package com.avensys.CVparserApplication.resume;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @GetMapping("/users/{id}/resumes")
    public ResponseEntity<List<ResumeCreateResponseDTO>> getResumesByUserId(@PathVariable long id) {
        List<ResumeCreateResponseDTO> resumeListResponseDTO = resumeService.getResumesByUserId(id);
        return new ResponseEntity<List<ResumeCreateResponseDTO>>(resumeListResponseDTO, HttpStatus.OK);
    }

    @PostMapping("resumes")
    public ResponseEntity<ResumeCreateResponseDTO> createResume(@ModelAttribute ResumeCreateRequestDTO resumeCreateRequest) {
        ResumeCreateResponseDTO chatResponse = resumeService.parseAndCreateResume(resumeCreateRequest);
        System.out.println("OUT");
        System.out.println(chatResponse);
        return new ResponseEntity<ResumeCreateResponseDTO>(chatResponse, HttpStatus.OK);
    }

}
