package com.example.authregistration.config;

import com.example.authregistration.entity.User;
import com.example.authregistration.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User defaultUser = new User();
            defaultUser.setFullName("John Doe");
            defaultUser.setEmail("john.doe@example.com");
            // Encodes the seed password securely
            defaultUser.setPassword(passwordEncoder.encode("password123"));
            userRepository.save(defaultUser);
            System.out.println(">>> Database is empty. Auto-seeded default test user: john.doe@example.com / password123");
        }
    }
}
