package com.authspace.backend.dto;

/**
 * Data Transfer Object for authentication API response returns.
 */
public class AuthResponse {

    private String id;
    private String fullName;
    private String email;
    private String token; // Mock authorization token string

    // Constructors
    public AuthResponse() {}

    public AuthResponse(String id, String fullName, String email, String token) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.token = token;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
