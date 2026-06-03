package com.dineflow.backend.controller;

import com.dineflow.backend.entity.Role;
import com.dineflow.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final RoleRepository roleRepository;

    @GetMapping("/roles")
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "DineFlow backend is running successfully";
    }

    @GetMapping("/me")
public Object getLoggedInUser(Authentication authentication) {
    return authentication;
}
}