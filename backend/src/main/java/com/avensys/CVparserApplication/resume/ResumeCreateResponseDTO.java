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
        String fileRef,
        LocalDateTime createdAt,
        LocalDateTime UpdatedAt,
        UserResponseDTO user,
        //Updated information added 12072023
        String firstName,
        String lastName,
        String gender,
        String currentLocation,
        String nationality,
        String jobTitle,
        String spokenLanguages,
        String primarySkills,
        String secondarySkills,
        String profile
) {


}
