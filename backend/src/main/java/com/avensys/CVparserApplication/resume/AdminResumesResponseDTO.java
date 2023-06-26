package com.avensys.CVparserApplication.resume;

import java.util.List;

public record AdminResumesResponseDTO(
        int totalPages,
        int page,
        List<ResumeCreateResponseDTO> resumeList
) {
}
