package com.avensys.CVparserApplication.user;

import java.time.LocalDateTime;

public record UserResponseDTO(
        long id,
        String email,
        String firstName,
        String lastName,
        String role,
        int resumeLimit,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
