package com.dineflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class TopSellingDishResponse {

    private String itemName;
    private Long totalQuantitySold;
    private BigDecimal totalRevenue;
}