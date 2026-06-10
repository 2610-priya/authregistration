package com.authspace.backend.service;

import com.authspace.backend.dto.LoginRequest;
import com.authspace.backend.dto.RegisterRequest;
import com.authspace.backend.model.User;
import com.authspace.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service class orchestrating database interactions and security checking logic.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registers a new user account with hashed password credentials.
     * @param request The user parameters payload.
     * @return Saved User document instance.
     */
    public User registerUser(RegisterRequest request) {
        // Prevent duplicate user registrations
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail().trim().toLowerCase());
        if (existingUser.isPresent()) {
            throw new RuntimeException("An account with this email already exists.");
        }

        // Hash password before saving
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        
        User newUser = new User(
            request.getFullName().trim(),
            request.getEmail().trim().toLowerCase(),
            hashedPassword
        );

        return userRepository.save(newUser);
    }

    /**
     * Authenticates a user based on password matching verification.
     * @param request The login credentials payload.
     * @return Logged-in User instance if successful.
     */
    public User authenticateUser(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        
        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Incorrect email or password."));

        // Match encrypted passwords
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect email or password.");
        }

        return user;
    }

    /**
     * Get the count of total registered users in the database.
     * @return count size
     */
    public long getTotalUsersCount() {
        return userRepository.count();
    }
}
