package com.dineflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class DashboardSummaryResponse {

    private BigDecimal todayRevenue;
    private BigDecimal thisMonthRevenue;
    private BigDecimal totalRevenue;

    private Long todayOrders;
    private Long thisMonthOrders;
    private Long totalOrders;

    private Long todayPendingOrders;
    private Long totalPendingOrders;

    private Long todayPaidOrders;
    private Long totalPaidOrders;

    private Long todayPendingPayments;
    private Long totalPendingPayments;

    private Long totalCustomers;
    private Long totalMenuItems;
    private Long totalTables;
}