package com.dineflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class OrderItemResponse {

    private Integer orderItemId;
    private Integer itemId;
    private String itemName;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;
}