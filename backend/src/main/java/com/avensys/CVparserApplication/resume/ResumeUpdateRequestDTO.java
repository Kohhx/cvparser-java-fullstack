package com.avensys.CVparserApplication.resume;

public record ResumeUpdateRequestDTO(
        long id,
        String fileName,
        String name,
        String email,
        String mobile,
        int yearsOfExperience,
        String[] skills,
        String[] companies
) {
}
