package com.dineflow.backend.controller;

import com.dineflow.backend.dto.PaymentRequest;
import com.dineflow.backend.dto.PaymentResponse;
import com.dineflow.backend.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public PaymentResponse makePayment(
            @Valid @RequestBody PaymentRequest request,
            Authentication authentication
    ) {
        requireRole(authentication, "ROLE_CUSTOMER");
        return paymentService.makePayment(request, authentication.getName());
    }

    @GetMapping
    public List<PaymentResponse> getAllPayments(Authentication authentication) {
        requireRole(authentication, "ROLE_ADMIN");
        return paymentService.getAllPayments();
    }

    @GetMapping("/order/{orderId}")
    public PaymentResponse getPaymentByOrder(
            @PathVariable Integer orderId,
            Authentication authentication
    ) {
        requireAnyRole(authentication, "ROLE_ADMIN", "ROLE_CUSTOMER");

        boolean isAdmin = hasRole(authentication, "ROLE_ADMIN");

        return paymentService.getPaymentByOrder(
                orderId,
                authentication.getName(),
                isAdmin
        );
    }

    private boolean hasRole(Authentication authentication, String role) {
        return authentication != null &&
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority -> authority.getAuthority().equals(role));
    }

    private void requireRole(Authentication authentication, String role) {
        requireAnyRole(authentication, role);
    }

    private void requireAnyRole(Authentication authentication, String... roles) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
        }

        for (String role : roles) {
            if (hasRole(authentication, role)) {
                return;
            }
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
    }
    @GetMapping("/filter")
public List<PaymentResponse> getPaymentsByDateRange(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
        Authentication authentication
) {
    requireRole(authentication, "ROLE_ADMIN");
    return paymentService.getPaymentsByDateRange(fromDate, toDate);
}

@GetMapping("/today")
public List<PaymentResponse> getTodayPayments(Authentication authentication) {
    requireRole(authentication, "ROLE_ADMIN");
    return paymentService.getTodayPayments();
}
}