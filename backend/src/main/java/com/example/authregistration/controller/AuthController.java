package com.example.authregistration.controller;

import com.example.authregistration.dto.JwtResponse;
import com.example.authregistration.dto.LoginRequest;
import com.example.authregistration.dto.MessageResponse;
import com.example.authregistration.dto.RegisterRequest;
import com.example.authregistration.entity.User;
import com.example.authregistration.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserService userService;

    // POST /api/auth/register
    @PostMapping("/auth/register")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        userService.registerUser(registerRequest);
        return new ResponseEntity<>(
                new MessageResponse("User registered successfully!", HttpStatus.CREATED.value()),
                HttpStatus.CREATED
        );
    }

    // POST /api/auth/login
    @PostMapping("/auth/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        String token = userService.loginUser(loginRequest);
        
        // Fetch user details to return in login response
        Optional<User> userOpt = userService.findByEmail(loginRequest.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Authentication failed", HttpStatus.UNAUTHORIZED.value()));
        }
        
        User user = userOpt.get();
        return ResponseEntity.ok(new JwtResponse(token, user.getEmail(), user.getFullName()));
    }

    // POST /api/auth/logout
    @PostMapping("/auth/logout")
    public ResponseEntity<MessageResponse> logoutUser() {
        // With stateless JWT, the client discards the token. 
        // This endpoint serves to notify client of successful session invalidation.
        return ResponseEntity.ok(new MessageResponse("Logout successful!", HttpStatus.OK.value()));
    }

    // GET /api/health
    @GetMapping("/health")
    public ResponseEntity<MessageResponse> healthCheck() {
        return ResponseEntity.ok(new MessageResponse("Healthy", HttpStatus.OK.value()));
    }
}
