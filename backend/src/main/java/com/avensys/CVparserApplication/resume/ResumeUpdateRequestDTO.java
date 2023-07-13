package com.avensys.CVparserApplication.resume;

public record ResumeUpdateRequestDTO(


        long id,
        String fileName,
        String name,
        String email,
        String mobile,
        int yearsOfExperience,
        String education,
        String[] skills,
        String[] companies,
        // Updated fields 12072023
        String firstName,
        String lastName,
        String gender,
        String nationality,
        String location,
        String jobTitle,
        String spokenLanguages,
        String primarySkills,
        String secondarySkills,
        String profile
) {
}
