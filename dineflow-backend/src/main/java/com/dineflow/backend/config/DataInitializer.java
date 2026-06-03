package com.dineflow.backend.config;

import com.dineflow.backend.entity.Role;
import com.dineflow.backend.entity.User;
import com.dineflow.backend.repository.RoleRepository;
import com.dineflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        String adminEmail = "admin@dineflow.com";

        if (!userRepository.existsByEmail(adminEmail)) {

            Role adminRole = roleRepository.findByRoleName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

            User admin = User.builder()
                    .fullName("System Admin")
                    .email(adminEmail)
                    .phone("9999999999")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .role(adminRole)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.save(admin);

            System.out.println("Default admin created successfully");
        }
    }
}