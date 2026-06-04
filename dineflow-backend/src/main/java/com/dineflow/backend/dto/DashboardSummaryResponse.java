package com.dineflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryResponse {

    private BigDecimal todayRevenue;
    private BigDecimal thisMonthRevenue;
    private BigDecimal totalRevenue;

    private Long todayOrders;
    private Long todayServedOrders;
    private Long todayUnservedOrders;

    private Long todayReservations;
    private Long todayServedReservations;
    private Long todayUnservedReservations;

    private Long totalTables;
    private Long reservedOrOccupiedTables;
    private Long availableTables;

    private Long todayTotalBills;
    private Long todayPaidBills;
    private Long todayUnpaidBills;

    private Long totalCustomers;
    private Long totalMenuItems;
}