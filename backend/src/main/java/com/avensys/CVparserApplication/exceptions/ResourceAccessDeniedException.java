package com.avensys.CVparserApplication.exceptions;

public class ResourceAccessDeniedException extends GlobalException {
    public ResourceAccessDeniedException(String message) {
        super(message);
    }

    public ResourceAccessDeniedException(String message, boolean includeStackTrace) {
        super(message, includeStackTrace);
    }
}
