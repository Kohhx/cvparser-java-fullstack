package com.avensys.CVparserApplication.exceptions;

import org.springframework.http.HttpStatus;

import java.time.LocalDate;

public class ExceptionResponse {
    private String message;
    private Throwable throwable;
    private HttpStatus httpStatus;
    private LocalDate timestamp;

    public ExceptionResponse() {
    }
    public ExceptionResponse(String message, HttpStatus httpStatus, LocalDate timestamp) {
        this(message, null, httpStatus, timestamp);
    }

    public ExceptionResponse(String message, Throwable throwable, HttpStatus httpStatus, LocalDate timestamp) {
        this.message = message;
        this.throwable = throwable;
        this.httpStatus = httpStatus;
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public Throwable getThrowable() {
        return throwable;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public LocalDate getTimestamp() {
        return timestamp;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setThrowable(Throwable throwable) {
        this.throwable = throwable;
    }

    public void setHttpStatus(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }

    public void setTimestamp(LocalDate timestamp) {
        this.timestamp = timestamp;
    }
}
