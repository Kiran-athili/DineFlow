package com.dineflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class DashboardResponse {

    private Long totalOrders;
    private Long totalCustomers;
    private Long totalMenuItems;
    private Long totalTables;
    private Long pendingOrders;
    private Long paidOrders;
    private BigDecimal totalRevenue;
}