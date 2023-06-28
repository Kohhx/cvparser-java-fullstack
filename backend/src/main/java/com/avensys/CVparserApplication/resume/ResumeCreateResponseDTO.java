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
        double yearsOfExperience,
        List<String> skills,
        List<String> companies,
        String education,
        String companiesDetails,
        LocalDateTime createdAt,
        LocalDateTime UpdatedAt,
        UserResponseDTO user
) {


}
