package com.avensys.CVparserApplication.authentication;

public class AuthenticationResponseDTO {

    private long id;
    private String message;
    private String email;
    private String token;
    private String role;

    public AuthenticationResponseDTO(long id, String message, String email, String token, String role) {
        this.id = id;
        this.message = message;
        this.email = email;
        this.token = token;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
