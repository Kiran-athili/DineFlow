package com.dineflow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateReservationStatusRequest {

    @NotBlank(message = "Reservation status is required")
    private String reservationStatus;
}