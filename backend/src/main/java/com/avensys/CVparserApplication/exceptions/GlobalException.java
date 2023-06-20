package com.avensys.CVparserApplication.exceptions;

public class GlobalException extends RuntimeException{
    public boolean includeStackTrace = false;

    public GlobalException(String message) {
        super(message);
    }

    public GlobalException(String message, boolean includeStackTrace) {
        super(message);
        this.includeStackTrace = includeStackTrace;
    }

    public boolean isIncludeStackTrace() {
        return includeStackTrace;
    }

    public void setIncludeStackTrace(boolean includeStackTrace) {
        this.includeStackTrace = includeStackTrace;
    }
}
