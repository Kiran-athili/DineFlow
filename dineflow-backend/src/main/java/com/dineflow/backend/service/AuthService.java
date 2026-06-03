package com.dineflow.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dineflow.backend.dto.AuthResponse;
import com.dineflow.backend.dto.ChangePasswordRequest;
import com.dineflow.backend.dto.CreateStaffRequest;
import com.dineflow.backend.dto.CustomerRegisterRequest;
import com.dineflow.backend.dto.ForgotPasswordRequest;
import com.dineflow.backend.dto.LoginRequest;
import com.dineflow.backend.dto.LoginResponse;
import com.dineflow.backend.dto.ResetPasswordRequest;
import com.dineflow.backend.dto.StaffResponse;
import com.dineflow.backend.dto.UpdateProfileRequest;
import com.dineflow.backend.entity.PasswordResetToken;
import com.dineflow.backend.entity.Role;
import com.dineflow.backend.entity.User;
import com.dineflow.backend.repository.PasswordResetTokenRepository;
import com.dineflow.backend.repository.RoleRepository;
import com.dineflow.backend.repository.UserRepository;
import com.dineflow.backend.security.JwtUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public AuthResponse registerCustomer(CustomerRegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Role customerRole = roleRepository.findByRoleName("CUSTOMER")
                .orElseThrow(() -> new RuntimeException("CUSTOMER role not found"));

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(customerRole)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        return new AuthResponse(
                "Customer registered successfully",
                savedUser.getUserId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole().getRoleName()
        );
    }
    public LoginResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

    if (!user.getIsActive()) {
        throw new RuntimeException("Account is inactive");
    }

    boolean passwordMatches = passwordEncoder.matches(
            request.getPassword(),
            user.getPasswordHash()
    );

    if (!passwordMatches) {
        throw new RuntimeException("Invalid email or password");
    }

    String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getRole().getRoleName()
    );

    return new LoginResponse(
            "Login successful",
            token,
            user.getUserId(),
            user.getFullName(),
            user.getEmail(),
            user.getRole().getRoleName()
    );
}

public AuthResponse createStaff(CreateStaffRequest request, String adminEmail) {

    if (userRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("Email already registered");
    }

    User adminUser = userRepository.findByEmail(adminEmail)
            .orElseThrow(() -> new RuntimeException("Admin user not found"));

    Role role = roleRepository.findByRoleName(request.getRoleName())
            .orElseThrow(() -> new RuntimeException("Role not found"));

    User user = User.builder()
            .fullName(request.getFullName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .role(role)
            .isActive(true)
            .createdBy(adminUser)
            .createdAt(LocalDateTime.now())
            .build();

    User savedUser = userRepository.save(user);

    return new AuthResponse(
            "User created successfully",
            savedUser.getUserId(),
            savedUser.getFullName(),
            savedUser.getEmail(),
            savedUser.getRole().getRoleName()
    );
}
public List<StaffResponse> getAllStaff() {

    List<User> staffUsers = userRepository.findByRoleRoleNameIn(
            List.of("ADMIN", "KITCHEN")
    );

    return staffUsers.stream()
            .map(user -> new StaffResponse(
                    user.getUserId(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getPhone(),
                    user.getRole().getRoleName(),
                    user.getIsActive(),
                    user.getStaffStatus(),
                    user.getCreatedAt()
            ))
            .toList();
}

public StaffResponse updateStaffStatus(Integer userId, String staffStatus) {

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Staff user not found"));

    String roleName = user.getRole().getRoleName();

    if (!roleName.equals("ADMIN") && !roleName.equals("KITCHEN")) {
        throw new RuntimeException("Only staff users can be updated");
    }

    String status = staffStatus.toUpperCase();

    if (!List.of("ACTIVE", "ON_LEAVE", "INACTIVE", "EXITED").contains(status)) {
        throw new RuntimeException("Invalid staff status");
    }

    user.setStaffStatus(status);

    if (status.equals("ACTIVE")) {
        user.setIsActive(true);
    } else {
        user.setIsActive(false);
    }

    User savedUser = userRepository.save(user);

    return new StaffResponse(
            savedUser.getUserId(),
            savedUser.getFullName(),
            savedUser.getEmail(),
            savedUser.getPhone(),
            savedUser.getRole().getRoleName(),
            savedUser.getIsActive(),
            savedUser.getStaffStatus(),
            savedUser.getCreatedAt()
    );
}
    public AuthResponse getMyProfile(String email) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return new AuthResponse(
            "Profile fetched successfully",
            user.getUserId(),
            user.getFullName(),
            user.getEmail(),
            user.getRole().getRoleName()
    );
}

public AuthResponse updateProfile(String email, UpdateProfileRequest request) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setFullName(request.getFullName());
    user.setPhone(request.getPhone());

    User updatedUser = userRepository.save(user);

    return new AuthResponse(
            "Profile updated successfully",
            updatedUser.getUserId(),
            updatedUser.getFullName(),
            updatedUser.getEmail(),
            updatedUser.getRole().getRoleName()
    );
}

public String changePassword(String email, ChangePasswordRequest request) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    boolean oldPasswordMatches = passwordEncoder.matches(
            request.getCurrentPassword(),
            user.getPasswordHash()
    );

    if (!oldPasswordMatches) {
        throw new RuntimeException("Current password is incorrect");
    }

    user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);

    return "Password changed successfully";
}
    
    public String forgotPassword(ForgotPasswordRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found with this email"));

    String token = UUID.randomUUID().toString();

    PasswordResetToken resetToken = PasswordResetToken.builder()
            .user(user)
            .resetToken(token)
            .expiryTime(LocalDateTime.now().plusMinutes(15))
            .isUsed(false)
            .createdAt(LocalDateTime.now())
            .build();

    passwordResetTokenRepository.save(resetToken);

    return "Reset token generated: " + token;
}

@Transactional
public String resetPassword(ResetPasswordRequest request) {

    PasswordResetToken resetToken = passwordResetTokenRepository
            .findByResetToken(request.getResetToken())
            .orElseThrow(() -> new RuntimeException("Invalid reset token"));

    if (resetToken.getIsUsed()) {
        throw new RuntimeException("Reset token already used");
    }

    if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
        throw new RuntimeException("Reset token expired");
    }

    User user = resetToken.getUser();
    user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));

    resetToken.setIsUsed(true);

    userRepository.save(user);
    passwordResetTokenRepository.save(resetToken);

    return "Password reset successfully";
}
}