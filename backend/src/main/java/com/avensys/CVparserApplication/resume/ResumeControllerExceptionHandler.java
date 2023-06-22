package com.avensys.CVparserApplication.resume;

import com.avensys.CVparserApplication.exceptions.ExceptionResponse;
import com.avensys.CVparserApplication.exceptions.UploadFileException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDate;

@ControllerAdvice
public class ResumeControllerExceptionHandler {

    @ExceptionHandler({UploadFileException.class})
    public ResponseEntity<Object> handleApiException(UploadFileException uploadFileException) {
        ExceptionResponse apiException = new ExceptionResponse(
                uploadFileException.getMessage(),
                uploadFileException,
                HttpStatus.BAD_REQUEST,
                LocalDate.now()
        );

        if (uploadFileException.includeStackTrace) {
            return new ResponseEntity<>(apiException, apiException.getHttpStatus());
        }

        apiException.setThrowable(null);
        return new ResponseEntity<>(apiException, apiException.getHttpStatus());
    }

}
