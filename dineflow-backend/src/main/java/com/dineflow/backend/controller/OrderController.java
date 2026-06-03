package com.dineflow.backend.controller;

import com.dineflow.backend.dto.OrderResponse;
import com.dineflow.backend.dto.PlaceOrderRequest;
import com.dineflow.backend.dto.UpdateOrderStatusRequest;
import com.dineflow.backend.service.OrderService;
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
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public OrderResponse placeOrder(
            @Valid @RequestBody PlaceOrderRequest request,
            Authentication authentication
    ) {
        requireRole(authentication, "ROLE_CUSTOMER");
        return orderService.placeOrder(request, authentication.getName());
    }

    @GetMapping("/my-orders")
    public List<OrderResponse> getMyOrders(Authentication authentication) {
        requireRole(authentication, "ROLE_CUSTOMER");
        return orderService.getMyOrders(authentication.getName());
    }

    @GetMapping
    public List<OrderResponse> getAllOrders(Authentication authentication) {
        requireAnyRole(authentication, "ROLE_ADMIN", "ROLE_KITCHEN");
        return orderService.getAllOrders();
    }

    @GetMapping("/status/{status}")
    public List<OrderResponse> getOrdersByStatus(
            @PathVariable String status,
            Authentication authentication
    ) {
        requireAnyRole(authentication, "ROLE_ADMIN", "ROLE_KITCHEN");
        return orderService.getOrdersByStatus(status);
    }

    @PatchMapping("/{orderId}/status")
    public OrderResponse updateOrderStatus(
            @PathVariable Integer orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request,
            Authentication authentication
    ) {
        requireAnyRole(authentication, "ROLE_ADMIN", "ROLE_KITCHEN");
        return orderService.updateOrderStatus(orderId, request);
    }

    private void requireRole(Authentication authentication, String role) {
        requireAnyRole(authentication, role);
    }

    private void requireAnyRole(Authentication authentication, String... roles) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
        }

        for (String role : roles) {
            boolean matched = authentication.getAuthorities()
                    .stream()
                    .anyMatch(authority -> authority.getAuthority().equals(role));

            if (matched) {
                return;
            }
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
    }

    @GetMapping("/filter")
public List<OrderResponse> getOrdersByDateRange(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
        Authentication authentication
) {
    requireAnyRole(authentication, "ROLE_ADMIN", "ROLE_KITCHEN");
    return orderService.getOrdersByDateRange(fromDate, toDate);
}

@GetMapping("/today")
public List<OrderResponse> getTodayOrders(Authentication authentication) {
    requireAnyRole(authentication, "ROLE_ADMIN", "ROLE_KITCHEN");
    return orderService.getTodayOrders();
}

@GetMapping("/pending-payments")
public List<OrderResponse> getPendingPayments(Authentication authentication) {
    requireRole(authentication, "ROLE_ADMIN");
    return orderService.getPendingPayments();
}

@GetMapping("/pending-payments/today")
public List<OrderResponse> getTodayPendingPayments(Authentication authentication) {
    requireRole(authentication, "ROLE_ADMIN");
    return orderService.getTodayPendingPayments();
}
}