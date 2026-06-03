package com.dineflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {

    private String message;
    private Integer userId;
    private String fullName;
    private String email;
    private String role;
}