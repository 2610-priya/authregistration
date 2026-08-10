package com.example.authregistration.controller;

import com.example.authregistration.dto.UserProfileResponse;
import com.example.authregistration.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    // GET /api/user/profile
    @GetMapping("/user/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile() {
        // Retrieve the authenticated user principal from security context
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        UserProfileResponse profileResponse = new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getCreatedAt()
        );
        
        return ResponseEntity.ok(profileResponse);
    }
}
