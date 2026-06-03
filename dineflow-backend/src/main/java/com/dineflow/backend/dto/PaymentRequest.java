package com.dineflow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {

    @NotNull(message = "Order ID is required")
    private Integer orderId;

    @NotBlank(message = "Payment method is required")
    @Pattern(
            regexp = "CASH|CARD|UPI",
            message = "Payment method must be CASH, CARD, or UPI"
    )
    private String paymentMethod;
}