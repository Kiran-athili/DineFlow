package com.dineflow.backend.repository;

import com.dineflow.backend.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Integer> {

    boolean existsByCategoryName(String categoryName);

    List<MenuCategory> findByIsActiveTrue();
}