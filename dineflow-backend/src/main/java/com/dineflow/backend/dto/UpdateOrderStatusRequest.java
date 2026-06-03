package com.dineflow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderStatusRequest {

    @NotBlank(message = "Order status is required")
    @Pattern(
            regexp = "PLACED|ACCEPTED|PREPARING|READY|SERVED|CANCELLED",
            message = "Status must be PLACED, ACCEPTED, PREPARING, READY, SERVED, or CANCELLED"
    )
    private String orderStatus;
}