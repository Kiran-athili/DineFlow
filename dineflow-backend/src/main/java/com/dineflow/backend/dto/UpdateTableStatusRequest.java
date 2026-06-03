package com.dineflow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTableStatusRequest {

    @NotBlank(message = "Status is required")
    @Pattern(
            regexp = "AVAILABLE|OCCUPIED|RESERVED",
            message = "Status must be AVAILABLE, OCCUPIED, or RESERVED"
    )
    private String status;
}