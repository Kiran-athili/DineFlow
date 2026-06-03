package com.dineflow.backend.controller;

import com.dineflow.backend.dto.AuthResponse;
import com.dineflow.backend.dto.ChangePasswordRequest;
import com.dineflow.backend.dto.CreateStaffRequest;
import com.dineflow.backend.dto.CustomerRegisterRequest;
import com.dineflow.backend.dto.ForgotPasswordRequest;
import com.dineflow.backend.dto.LoginRequest;
import com.dineflow.backend.dto.LoginResponse;
import com.dineflow.backend.dto.ResetPasswordRequest;
import com.dineflow.backend.dto.UpdateProfileRequest;
import com.dineflow.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.dineflow.backend.dto.StaffResponse;
import java.util.List;
import com.dineflow.backend.dto.UpdateStaffStatusRequest;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register-customer")
    public AuthResponse registerCustomer(@Valid @RequestBody CustomerRegisterRequest request) {
        return authService.registerCustomer(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/admin/create-staff")
    public AuthResponse createStaff(
            @Valid @RequestBody CreateStaffRequest request,
            Authentication authentication
    ) {
        requireRole(authentication, "ROLE_ADMIN");
        return authService.createStaff(request, authentication.getName());
    }

    @PatchMapping("/admin/staff/{userId}/status")
public StaffResponse updateStaffStatus(
        @PathVariable Integer userId,
        @Valid @RequestBody UpdateStaffStatusRequest request,
        Authentication authentication
) {
    requireRole(authentication, "ROLE_ADMIN");
    return authService.updateStaffStatus(userId, request.getStaffStatus());
}

    @GetMapping("/admin/staff")
public List<StaffResponse> getAllStaff(Authentication authentication) {
    requireRole(authentication, "ROLE_ADMIN");
    return authService.getAllStaff();
}

    @GetMapping("/profile")
    public AuthResponse getMyProfile(Authentication authentication) {
        requireLogin(authentication);
        return authService.getMyProfile(authentication.getName());
    }

    @PutMapping("/profile")
    public AuthResponse updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {
        requireLogin(authentication);
        return authService.updateProfile(authentication.getName(), request);
    }

    @PutMapping("/change-password")
    public String changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        requireLogin(authentication);
        return authService.changePassword(authentication.getName(), request);
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public String resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }

    private void requireLogin(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
        }
    }

    private void requireRole(Authentication authentication, String role) {
        requireLogin(authentication);

        boolean allowed = authentication.getAuthorities()
                .stream()
                .anyMatch(authority -> authority.getAuthority().equals(role));

        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
    }
}