package com.dineflow.backend.repository;

import com.dineflow.backend.entity.RestaurantTable;
import com.dineflow.backend.entity.TableReservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface TableReservationRepository extends JpaRepository<TableReservation, Integer> {

    List<TableReservation> findAllByOrderByCreatedAtDesc();

    List<TableReservation> findByCustomerEmailOrderByCreatedAtDesc(String email);

    List<TableReservation> findByReservationDateOrderByReservationTimeAsc(LocalDate reservationDate);

    boolean existsByRestaurantTableAndReservationDateAndReservationTimeAndReservationStatusIn(
            RestaurantTable restaurantTable,
            LocalDate reservationDate,
            LocalTime reservationTime,
            List<String> reservationStatuses
    );
}