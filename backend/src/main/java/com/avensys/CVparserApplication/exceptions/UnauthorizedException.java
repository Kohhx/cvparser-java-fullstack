package com.avensys.CVparserApplication.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class UnauthorizedException extends GlobalException{
    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException(String message, boolean includeStackTrace) {
        super(message, includeStackTrace);
    }
}
