package com.dineflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class PaymentResponse {

    private Integer paymentId;
    private Integer orderId;
    private String customerName;
    private String paymentMethod;
    private String paymentStatus;
    private BigDecimal paidAmount;
    private LocalDateTime paidAt;
}