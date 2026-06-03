package com.dineflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class DashboardAnalyticsResponse {

    private List<AnalyticsPointResponse> dailyRevenue;
    private List<AnalyticsPointResponse> monthlyRevenue;
    private List<AnalyticsPointResponse> yearlyRevenue;

    private List<AnalyticsPointResponse> dailyCustomers;
    private List<AnalyticsPointResponse> monthlyCustomers;
    private List<AnalyticsPointResponse> yearlyCustomers;

    private List<TopSellingDishResponse> topSellingDishes;
}