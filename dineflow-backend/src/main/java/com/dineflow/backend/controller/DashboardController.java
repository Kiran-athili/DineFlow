package com.dineflow.backend.controller;

import com.dineflow.backend.dto.DashboardAnalyticsResponse;
import com.dineflow.backend.dto.DashboardResponse;
import com.dineflow.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.dineflow.backend.dto.DashboardSummaryResponse;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    public DashboardResponse getAdminDashboard(Authentication authentication) {
        requireRole(authentication, "ROLE_ADMIN");
        return dashboardService.getAdminDashboard();
    }

    @GetMapping("/admin/analytics")
    public DashboardAnalyticsResponse getAdminAnalytics(Authentication authentication) {
        requireRole(authentication, "ROLE_ADMIN");
        return dashboardService.getAdminAnalytics();
    }

    private void requireRole(Authentication authentication, String role) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
        }

        boolean matched = authentication.getAuthorities()
                .stream()
                .anyMatch(authority -> authority.getAuthority().equals(role));

        if (!matched) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
    }

    @GetMapping("/admin/summary")
public DashboardSummaryResponse getAdminSummary(Authentication authentication) {
    requireRole(authentication, "ROLE_ADMIN");
    return dashboardService.getAdminSummary();
}
}