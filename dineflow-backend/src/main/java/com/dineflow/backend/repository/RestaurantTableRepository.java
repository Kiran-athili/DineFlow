package com.dineflow.backend.repository;

import com.dineflow.backend.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.time.LocalDate;
import java.util.List;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Integer> {

    boolean existsByTableNumber(String tableNumber);

    List<RestaurantTable> findByStatus(String status);

    @Query(value = """
        SELECT COUNT(DISTINCT t.table_id)
        FROM restaurant_tables t
        LEFT JOIN table_reservations r 
            ON r.table_id = t.table_id
            AND r.reservation_date = :today
            AND r.reservation_status IN ('BOOKED', 'CONFIRMED')
        WHERE t.status IN ('OCCUPIED', 'RESERVED')
           OR r.reservation_id IS NOT NULL
        """, nativeQuery = true)
Long countReservedOrOccupiedTablesForToday(@Param("today") LocalDate today);
}