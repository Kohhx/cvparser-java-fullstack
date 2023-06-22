package com.avensys.CVparserApplication.resume;

import java.util.List;

public record ResumeCreateResponseDTO(
        long id,
        String filename,
        String name,
        String email,
        String mobile,
        int yearsOfExperience,
        List<String> skills,
        List<String> companies
) {


}
