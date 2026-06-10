package com.authspace.backend.controller;

import com.authspace.backend.dto.AuthResponse;
import com.authspace.backend.dto.LoginRequest;
import com.authspace.backend.dto.RegisterRequest;
import com.authspace.backend.model.User;
import com.authspace.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Rest Controller handling login, registration, and stat request endpoints.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint for user registration.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            User registeredUser = authService.registerUser(request);
            
            // Mock authentication token
            String mockToken = "tkn_" + UUID.randomUUID().toString().replace("-", "") + "_" + System.currentTimeMillis();
            
            AuthResponse response = new AuthResponse(
                registeredUser.getId(),
                registeredUser.getFullName(),
                registeredUser.getEmail(),
                mockToken
            );
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException ex) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", ex.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Endpoint for user login.
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) {
        try {
            User authenticatedUser = authService.authenticateUser(request);
            
            // Mock authentication token
            String mockToken = "tkn_" + UUID.randomUUID().toString().replace("-", "") + "_" + System.currentTimeMillis();
            
            AuthResponse response = new AuthResponse(
                authenticatedUser.getId(),
                authenticatedUser.getFullName(),
                authenticatedUser.getEmail(),
                mockToken
            );
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException ex) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", ex.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Endpoint to fetch the total number of registered users.
     */
    @GetMapping("/users/count")
    public ResponseEntity<?> getTotalUsers() {
        Map<String, Long> countResponse = new HashMap<>();
        countResponse.put("count", authService.getTotalUsersCount());
        return new ResponseEntity<>(countResponse, HttpStatus.OK);
    }

    /**
     * Exception Handler for validation payload errors.
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
}
