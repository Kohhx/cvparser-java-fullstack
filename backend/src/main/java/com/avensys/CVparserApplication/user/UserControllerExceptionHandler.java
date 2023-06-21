package com.avensys.CVparserApplication.user;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.avensys.CVparserApplication.exceptions.ExceptionResponse;
import com.avensys.CVparserApplication.exceptions.ResourceNotFoundException;

@ControllerAdvice
public class UserControllerExceptionHandler {

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
