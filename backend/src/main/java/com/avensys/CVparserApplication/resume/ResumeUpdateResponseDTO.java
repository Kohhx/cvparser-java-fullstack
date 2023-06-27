package com.avensys.CVparserApplication.resume;

import java.util.List;

public record ResumeUpdateResponseDTO(
        long id,
        String filename,
        String name,
        String email,
        String mobile,
        double yearsOfExperience,
        List<String> skills,
        List<String> companies) {

}
