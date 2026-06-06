package com.dineflow.backend.repository;

import com.dineflow.backend.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {

    List<MenuItem> findByIsAvailableTrue();

    List<MenuItem> findByCategoryCategoryIdAndIsAvailableTrue(Integer categoryId);

    List<MenuItem> findAllByOrderByItemIdDesc();

    List<MenuItem> findByIsAvailableTrueOrderByItemIdDesc();

    List<MenuItem> findByCategoryCategoryIdAndIsAvailableTrueOrderByItemIdDesc(Integer categoryId);
}