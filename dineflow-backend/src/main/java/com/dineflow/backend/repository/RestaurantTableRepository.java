package com.dineflow.backend.repository;

import com.dineflow.backend.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.time.LocalDate;
import java.time.LocalTime;
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

@Query(value = """
        SELECT t.*
        FROM restaurant_tables t
        WHERE t.capacity >= :guestCount
          AND t.table_id NOT IN (
              SELECT r.table_id
              FROM table_reservations r
              WHERE r.reservation_date = :reservationDate
                AND r.reservation_time = :reservationTime
                AND r.reservation_status IN ('BOOKED', 'CONFIRMED')
          )
        ORDER BY t.table_number
        """, nativeQuery = true)
List<RestaurantTable> findAvailableTablesForReservation(
        @Param("reservationDate") LocalDate reservationDate,
        @Param("reservationTime") LocalTime reservationTime,
        @Param("guestCount") Integer guestCount
);
}