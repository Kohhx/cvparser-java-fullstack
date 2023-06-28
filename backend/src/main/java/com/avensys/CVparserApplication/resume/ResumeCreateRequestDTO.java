package com.avensys.CVparserApplication.resume;

import org.springframework.web.multipart.MultipartFile;

public record ResumeCreateRequestDTO(

        String fileName,

        MultipartFile file
) {
}
