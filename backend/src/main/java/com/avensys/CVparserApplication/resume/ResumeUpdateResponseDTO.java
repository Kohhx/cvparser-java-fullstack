package com.avensys.CVparserApplication.resume;

import java.util.List;

public record ResumeUpdateResponseDTO(
        long id,
        String filename,
        String name,
        String email,
        String mobile,
        double yearsOfExperience,
        String education,
        String companiesDetails,
        List<String> skills,
        List<String> companies,
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
