package com.dineflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class StaffResponse {

    private Integer userId;
    private String fullName;
    private String email;
    private String phone;
    private String roleName;
    private Boolean isActive;
    private String staffStatus;
    private LocalDateTime createdAt;
}