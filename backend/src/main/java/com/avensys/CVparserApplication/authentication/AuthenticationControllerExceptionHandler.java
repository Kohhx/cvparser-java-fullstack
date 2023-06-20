package com.avensys.CVparserApplication.authentication;

import com.avensys.CVparserApplication.exceptions.DuplicateResourceException;
import com.avensys.CVparserApplication.exceptions.ExceptionResponse;
import com.avensys.CVparserApplication.exceptions.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDate;

@ControllerAdvice
public class AuthenticationControllerExceptionHandler {

    @ExceptionHandler({DuplicateResourceException.class})
    public ResponseEntity<Object> handleApiException(DuplicateResourceException duplicateResourceException) {
        ExceptionResponse apiException = new ExceptionResponse(
                duplicateResourceException.getMessage(),
                duplicateResourceException,
                HttpStatus.CONFLICT,
                LocalDate.now()
        );

        if (duplicateResourceException.includeStackTrace) {
            return new ResponseEntity<>(apiException, apiException.getHttpStatus());
        }

        apiException.setThrowable(null);
        return new ResponseEntity<>(apiException, apiException.getHttpStatus());
    }

    @ExceptionHandler({ResourceNotFoundException.class})
    public ResponseEntity<Object> handleApiException(ResourceNotFoundException resourceNotFoundException) {
        ExceptionResponse apiException = new ExceptionResponse(
                resourceNotFoundException.getMessage(),
                resourceNotFoundException,
                HttpStatus.NOT_FOUND,
                LocalDate.now()
        );

        if (resourceNotFoundException.includeStackTrace) {
            return new ResponseEntity<>(apiException, apiException.getHttpStatus());
        }

        apiException.setThrowable(null);
        return new ResponseEntity<>(apiException, apiException.getHttpStatus());
    }
}
