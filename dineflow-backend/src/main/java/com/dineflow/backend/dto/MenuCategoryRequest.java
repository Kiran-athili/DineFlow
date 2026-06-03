package com.dineflow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MenuCategoryRequest {

    @NotBlank(message = "Category name is required")
    private String categoryName;

    private String description;

    private String imageUrl;
}