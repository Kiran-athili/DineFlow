package com.dineflow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStaffStatusRequest {

    @NotBlank(message = "Staff status is required")
    private String staffStatus;
}