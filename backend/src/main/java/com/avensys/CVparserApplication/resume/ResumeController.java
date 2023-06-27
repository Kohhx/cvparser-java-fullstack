package com.avensys.CVparserApplication.resume;

import com.avensys.CVparserApplication.response.CustomResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

////    @PreAuthorize("hasRole('ROLE_USER')")
//    @PreAuthorize("hasAnyRole('ROLE_FREE','ROLE_PAID','ROLE_ADMIN')")
//    @GetMapping("/users/{userId}/resumes/{resumeId}")
//    public ResponseEntity<ResumeUpdateResponseDTO> getResume(@PathVariable long userId, @PathVariable long resumeId) {
//        ResumeUpdateResponseDTO resumeResponse = resumeService.getResume(userId, resumeId);
//        return new ResponseEntity<ResumeUpdateResponseDTO>(resumeResponse, HttpStatus.OK);
//    }

    //    @PreAuthorize("hasRole('ROLE_USER')")
    @PreAuthorize("hasAnyRole('ROLE_FREE','ROLE_PAID','ROLE_ADMIN')")
    @GetMapping("/users/{userId}/resumes/{resumeId}")
    public ResponseEntity<ResumeCreateResponseDTO> getResume(@PathVariable long userId, @PathVariable long resumeId) {
        ResumeCreateResponseDTO resumeResponse = resumeService.getResume(userId, resumeId);
        return new ResponseEntity<ResumeCreateResponseDTO>(resumeResponse, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ROLE_FREE','ROLE_PAID','ROLE_ADMIN')")
    @GetMapping("/users/{id}/resumes")
    public ResponseEntity<List<ResumeCreateResponseDTO>> getResumesByUserId(@PathVariable long id) {
        List<ResumeCreateResponseDTO> resumeListResponseDTO = resumeService.getResumesByUserId(id);
        return new ResponseEntity<List<ResumeCreateResponseDTO>>(resumeListResponseDTO, HttpStatus.OK);
    }

    @PostMapping("resumes")
    @PreAuthorize("hasAnyRole('ROLE_FREE','ROLE_PAID','ROLE_ADMIN')")
    public ResponseEntity<ResumeCreateResponseDTO> createResume(@ModelAttribute ResumeCreateRequestDTO resumeCreateRequest) {
        ResumeCreateResponseDTO chatResponse = resumeService.parseAndCreateResume(resumeCreateRequest);
        System.out.println("OUT");
//        System.out.println(chatResponse);
        return new ResponseEntity<ResumeCreateResponseDTO>(chatResponse, HttpStatus.OK);
    }

    // Newer algo for chat GPT
    @PostMapping("resumes/test")
    @PreAuthorize("hasAnyRole('ROLE_FREE','ROLE_PAID','ROLE_ADMIN')")
    public ResponseEntity<ResumeCreateResponseDTO> createResumeTest(@ModelAttribute ResumeCreateRequestDTO resumeCreateRequest) {
        ResumeCreateResponseDTO chatResponse = resumeService.resumeTest(resumeCreateRequest);
        System.out.println("OUT");
        return new ResponseEntity<ResumeCreateResponseDTO>(chatResponse, HttpStatus.OK);
    }

    @PatchMapping("resumes/{id}")
    @PreAuthorize("hasAnyRole('ROLE_FREE','ROLE_PAID','ROLE_ADMIN')")
    public ResponseEntity<ResumeUpdateResponseDTO> updateResume(@RequestBody ResumeUpdateRequestDTO resumeUpdateRequest) {
        ResumeUpdateResponseDTO resumeUpdateResponse =  resumeService.updateResume(resumeUpdateRequest);
        return new ResponseEntity<ResumeUpdateResponseDTO>(resumeUpdateResponse, HttpStatus.OK);
    }

    @DeleteMapping("resumes/{id}")
    @PreAuthorize("hasAnyRole('ROLE_FREE','ROLE_PAID','ROLE_ADMIN')")
    public ResponseEntity<CustomResponse> deleteResume(@PathVariable long id) {
        resumeService.deleteResume(id);
        return new ResponseEntity<CustomResponse>(new CustomResponse("Resume deleted successfully"), HttpStatus.OK);
    }

    //     Admin Routes
    @DeleteMapping("admin/users/{userId}/resumes/{resumeId}")
    public ResponseEntity<CustomResponse> deleteResume(@PathVariable long userId, @PathVariable long resumeId) {
        resumeService.deleteUserResume(userId, resumeId);
        return new ResponseEntity<CustomResponse>(new CustomResponse("Resume deleted successfully"), HttpStatus.OK);
    }

    @GetMapping("/admin/resumes")
    public ResponseEntity<AdminResumesResponseDTO> getAllResumes(@RequestParam int page, @RequestParam(required = false) String keywords, @RequestParam(required = false) int size) {
//        int size = 15;
        System.out.println("Page:" + page);
        System.out.println("Keywords: :" +  keywords);
        AdminResumesResponseDTO adminResumeResponseDTO;
        if (keywords.isEmpty()) {
            System.out.println("Empty");
             adminResumeResponseDTO = resumeService.getAllResumes(page, size);
        } else {
            System.out.println("With Key words");
             adminResumeResponseDTO = resumeService.getAllResumesWithSearch(page, size, keywords);
        }
        return new ResponseEntity<AdminResumesResponseDTO>(adminResumeResponseDTO, HttpStatus.OK);
    }

}
