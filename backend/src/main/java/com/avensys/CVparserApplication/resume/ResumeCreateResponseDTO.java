package com.avensys.CVparserApplication.resume;

import com.avensys.CVparserApplication.user.UserResponseDTO;

import java.time.LocalDateTime;
import java.util.List;

public record ResumeCreateResponseDTO(
        long id,
        String filename,
        String name,
        String email,
        String mobile,
        int yearsOfExperience,
        List<String> skills,
        List<String> companies,
        LocalDateTime createdAt,
        LocalDateTime UpdatedAt,
        UserResponseDTO user
) {


}
