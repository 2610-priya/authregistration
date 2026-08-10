package com.example.authregistration.dto;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String email;
    private String fullName;

    public JwtResponse(String accessToken, String email, String fullName) {
        this.token = accessToken;
        this.email = email;
        this.fullName = fullName;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
