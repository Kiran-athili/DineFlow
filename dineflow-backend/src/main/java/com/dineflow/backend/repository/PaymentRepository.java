package com.dineflow.backend.repository;

import com.dineflow.backend.entity.Payment;
import com.dineflow.backend.entity.RestaurantOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    boolean existsByOrder(RestaurantOrder order);

    Optional<Payment> findByOrder(RestaurantOrder order);

    List<Payment> findAllByOrderByPaidAtDesc();

    List<Payment> findByPaidAtBetweenOrderByPaidAtDesc(
            LocalDateTime fromDate,
            LocalDateTime toDate
    );

    Long countByPaidAtBetween(
            LocalDateTime fromDate,
            LocalDateTime toDate
    );

    @Query("SELECT COALESCE(SUM(p.paidAmount), 0) FROM Payment p WHERE p.paymentStatus = 'SUCCESS'")
    BigDecimal getTotalRevenue();

    @Query("""
            SELECT COALESCE(SUM(p.paidAmount), 0)
            FROM Payment p
            WHERE p.paymentStatus = 'SUCCESS'
            AND p.paidAt BETWEEN :fromDate AND :toDate
            """)
    BigDecimal getRevenueBetween(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate
    );

    @Query(value = """
            SELECT DATE(p.paid_at) AS label, COALESCE(SUM(p.paid_amount), 0) AS value
            FROM payments p
            WHERE p.payment_status = 'SUCCESS'
            AND p.paid_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
            GROUP BY DATE(p.paid_at)
            ORDER BY DATE(p.paid_at)
            """, nativeQuery = true)
    List<Object[]> getDailyRevenueLast7Days();

    @Query(value = """
            SELECT DATE_FORMAT(p.paid_at, '%Y-%m') AS label, COALESCE(SUM(p.paid_amount), 0) AS value
            FROM payments p
            WHERE p.payment_status = 'SUCCESS'
            AND p.paid_at >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH)
            GROUP BY DATE_FORMAT(p.paid_at, '%Y-%m')
            ORDER BY MIN(p.paid_at)
            """, nativeQuery = true)
    List<Object[]> getMonthlyRevenueLast12Months();

    @Query(value = """
            SELECT YEAR(p.paid_at) AS label, COALESCE(SUM(p.paid_amount), 0) AS value
            FROM payments p
            WHERE p.payment_status = 'SUCCESS'
            GROUP BY YEAR(p.paid_at)
            ORDER BY YEAR(p.paid_at)
            """, nativeQuery = true)
    List<Object[]> getYearlyRevenue();
}