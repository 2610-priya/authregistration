package com.example.authregistration.service;

import com.example.authregistration.dto.LoginRequest;
import com.example.authregistration.dto.RegisterRequest;
import com.example.authregistration.entity.User;
import com.example.authregistration.repository.UserRepository;
import com.example.authregistration.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public User registerUser(RegisterRequest registerRequest) {
        // Prevent duplicate email registrations
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email address already in use!");
        }

        User user = new User();
        user.setFullName(registerRequest.getFullName());
        user.setEmail(registerRequest.getEmail());
        // Securely hash password using BCrypt
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        return userRepository.save(user);
    }

    public String loginUser(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        // Validate email presence and verify password hash match
        if (userOpt.isEmpty() || !passwordEncoder.matches(loginRequest.getPassword(), userOpt.get().getPassword())) {
            throw new IllegalArgumentException("Invalid email or password!");
        }

        // Generate JWT Token
        return tokenProvider.generateToken(loginRequest.getEmail());
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
