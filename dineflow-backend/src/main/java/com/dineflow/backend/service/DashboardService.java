package com.dineflow.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dineflow.backend.dto.AnalyticsPointResponse;
import com.dineflow.backend.dto.DashboardAnalyticsResponse;
import com.dineflow.backend.dto.DashboardResponse;
import com.dineflow.backend.dto.DashboardSummaryResponse;
import com.dineflow.backend.dto.TopSellingDishResponse;
import com.dineflow.backend.repository.MenuItemRepository;
import com.dineflow.backend.repository.OrderItemRepository;
import com.dineflow.backend.repository.PaymentRepository;
import com.dineflow.backend.repository.RestaurantOrderRepository;
import com.dineflow.backend.repository.RestaurantTableRepository;
import com.dineflow.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final RestaurantOrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantTableRepository tableRepository;
    private final PaymentRepository paymentRepository;
    private final OrderItemRepository orderItemRepository;

    public DashboardResponse getAdminDashboard() {

        Long totalOrders = orderRepository.count();
        Long totalCustomers = userRepository.countByRoleRoleName("CUSTOMER");
        Long totalMenuItems = menuItemRepository.count();
        Long totalTables = tableRepository.count();

        Long pendingOrders = orderRepository.countByOrderStatus("PLACED");
        Long paidOrders = orderRepository.countByOrderStatus("PAID");

        BigDecimal totalRevenue = paymentRepository.getTotalRevenue();

        return new DashboardResponse(
                totalOrders,
                totalCustomers,
                totalMenuItems,
                totalTables,
                pendingOrders,
                paidOrders,
                totalRevenue
        );
    }

    public DashboardAnalyticsResponse getAdminAnalytics() {

        return new DashboardAnalyticsResponse(
                mapToAnalyticsPoints(paymentRepository.getDailyRevenueLast7Days()),
                mapToAnalyticsPoints(paymentRepository.getMonthlyRevenueLast12Months()),
                mapToAnalyticsPoints(paymentRepository.getYearlyRevenue()),

                mapToAnalyticsPoints(userRepository.getDailyCustomersLast7Days()),
                mapToAnalyticsPoints(userRepository.getMonthlyCustomersLast12Months()),
                mapToAnalyticsPoints(userRepository.getYearlyCustomers()),

                mapToTopSellingDishes(orderItemRepository.getTopSellingDishes())
        );
    }

    private List<AnalyticsPointResponse> mapToAnalyticsPoints(List<Object[]> rows) {

        return rows.stream()
                .map(row -> new AnalyticsPointResponse(
                        String.valueOf(row[0]),
                        toBigDecimal(row[1])
                ))
                .toList();
    }

    private List<TopSellingDishResponse> mapToTopSellingDishes(List<Object[]> rows) {

        return rows.stream()
                .map(row -> new TopSellingDishResponse(
                        String.valueOf(row[0]),
                        ((Number) row[1]).longValue(),
                        toBigDecimal(row[2])
                ))
                .toList();
    }

    private BigDecimal toBigDecimal(Object value) {

        if (value == null) {
            return BigDecimal.ZERO;
        }

        if (value instanceof BigDecimal bigDecimal) {
            return bigDecimal;
        }

        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }

        return new BigDecimal(value.toString());
    }

    public DashboardSummaryResponse getAdminSummary() {

    LocalDate today = LocalDate.now();

    LocalDateTime todayStart = today.atStartOfDay();
    LocalDateTime todayEnd = today.atTime(23, 59, 59);

    LocalDate monthStartDate = today.withDayOfMonth(1);
    LocalDateTime monthStart = monthStartDate.atStartOfDay();
    LocalDateTime monthEnd = today.atTime(23, 59, 59);

    BigDecimal todayRevenue = paymentRepository.getRevenueBetween(todayStart, todayEnd);
    BigDecimal thisMonthRevenue = paymentRepository.getRevenueBetween(monthStart, monthEnd);
    BigDecimal totalRevenue = paymentRepository.getTotalRevenue();

    Long todayOrders = orderRepository.countByCreatedAtBetween(todayStart, todayEnd);
    Long thisMonthOrders = orderRepository.countByCreatedAtBetween(monthStart, monthEnd);
    Long totalOrders = orderRepository.count();

    Long todayPendingOrders = orderRepository.countByOrderStatusAndCreatedAtBetween(
            "PLACED",
            todayStart,
            todayEnd
    );

    Long totalPendingOrders = orderRepository.countByOrderStatus("PLACED");

    Long todayPaidOrders = orderRepository.countByOrderStatusAndCreatedAtBetween(
            "PAID",
            todayStart,
            todayEnd
    );

    Long totalPaidOrders = orderRepository.countByOrderStatus("PAID");

    Long todayPendingPayments = (long) orderRepository
            .findByOrderStatusNotInAndCreatedAtBetweenOrderByCreatedAtDesc(
                    List.of("PAID", "CANCELLED"),
                    todayStart,
                    todayEnd
            )
            .size();

    Long totalPendingPayments = (long) orderRepository
            .findByOrderStatusNotInOrderByCreatedAtDesc(List.of("PAID", "CANCELLED"))
            .size();

    Long totalCustomers = userRepository.countByRoleRoleName("CUSTOMER");
    Long totalMenuItems = menuItemRepository.count();
    Long totalTables = tableRepository.count();

    return new DashboardSummaryResponse(
            todayRevenue,
            thisMonthRevenue,
            totalRevenue,

            todayOrders,
            thisMonthOrders,
            totalOrders,

            todayPendingOrders,
            totalPendingOrders,

            todayPaidOrders,
            totalPaidOrders,

            todayPendingPayments,
            totalPendingPayments,

            totalCustomers,
            totalMenuItems,
            totalTables
    );
}
}