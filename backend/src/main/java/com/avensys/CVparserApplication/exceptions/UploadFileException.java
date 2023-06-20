package com.avensys.CVparserApplication.exceptions;

public class UploadFileException extends GlobalException {
    public UploadFileException(String message) {
        super(message);
    }

    public UploadFileException(String message, boolean includeStackTrace) {
        super(message, includeStackTrace);
    }
}
