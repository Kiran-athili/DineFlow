package com.dineflow.backend.repository;

import com.dineflow.backend.entity.ReservationItem;
import com.dineflow.backend.entity.TableReservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationItemRepository extends JpaRepository<ReservationItem, Integer> {

    List<ReservationItem> findByReservation(TableReservation reservation);
}