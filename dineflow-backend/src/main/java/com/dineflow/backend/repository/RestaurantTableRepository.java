package com.dineflow.backend.repository;

import com.dineflow.backend.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Integer> {

    boolean existsByTableNumber(String tableNumber);

    List<RestaurantTable> findByStatus(String status);
}