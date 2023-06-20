package com.avensys.CVparserApplication.exceptions;

public class ResourceNotFoundException extends GlobalException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, boolean includeStackTrace) {
        super(message, includeStackTrace);
    }
}
