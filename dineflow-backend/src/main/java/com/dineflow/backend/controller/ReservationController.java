package com.dineflow.backend.controller;

import com.dineflow.backend.dto.CreateReservationRequest;
import com.dineflow.backend.dto.ReservationResponse;
import com.dineflow.backend.dto.UpdateReservationStatusRequest;
import com.dineflow.backend.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ReservationResponse createReservation(
            @Valid @RequestBody CreateReservationRequest request,
            Authentication authentication
    ) {
        requireRole(authentication, "ROLE_CUSTOMER");
        return reservationService.createReservation(request, authentication.getName());
    }

    @GetMapping("/my-reservations")
    public List<ReservationResponse> getMyReservations(Authentication authentication) {
        requireRole(authentication, "ROLE_CUSTOMER");
        return reservationService.getMyReservations(authentication.getName());
    }

    @GetMapping
    public List<ReservationResponse> getAllReservations(Authentication authentication) {
        requireRole(authentication, "ROLE_ADMIN");
        return reservationService.getAllReservations();
    }

    @GetMapping("/date")
    public List<ReservationResponse> getReservationsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate reservationDate,
            Authentication authentication
    ) {
        requireRole(authentication, "ROLE_ADMIN");
        return reservationService.getReservationsByDate(reservationDate);
    }

    @PatchMapping("/{reservationId}/status")
    public ReservationResponse updateReservationStatus(
            @PathVariable Integer reservationId,
            @Valid @RequestBody UpdateReservationStatusRequest request,
            Authentication authentication
    ) {
        requireRole(authentication, "ROLE_ADMIN");
        return reservationService.updateReservationStatus(reservationId, request);
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
}