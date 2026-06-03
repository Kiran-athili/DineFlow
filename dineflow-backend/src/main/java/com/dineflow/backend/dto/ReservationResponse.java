package com.dineflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ReservationResponse {

    private Integer reservationId;
    private String customerName;
    private String customerEmail;
    private String tableNumber;
    private LocalDate reservationDate;
    private LocalTime reservationTime;
    private Integer guestCount;
    private String reservationStatus;
    private BigDecimal preorderAmount;
    private LocalDateTime createdAt;
    private List<ReservationItemResponse> items;
}