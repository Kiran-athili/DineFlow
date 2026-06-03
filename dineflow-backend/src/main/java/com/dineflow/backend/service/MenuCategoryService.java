package com.dineflow.backend.service;

import com.dineflow.backend.dto.MenuCategoryRequest;
import com.dineflow.backend.entity.MenuCategory;
import com.dineflow.backend.repository.MenuCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuCategoryService {

    private final MenuCategoryRepository menuCategoryRepository;

    public MenuCategory createCategory(MenuCategoryRequest request) {

        if (menuCategoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new RuntimeException("Category already exists");
        }

        MenuCategory category = MenuCategory.builder()
                .categoryName(request.getCategoryName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .isActive(true)
                .build();

        return menuCategoryRepository.save(category);
    }

    public List<MenuCategory> getAllCategories() {
        return menuCategoryRepository.findAll();
    }

    public List<MenuCategory> getActiveCategories() {
        return menuCategoryRepository.findByIsActiveTrue();
    }

    public MenuCategory updateCategory(Integer categoryId, MenuCategoryRequest request) {

        MenuCategory category = menuCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setCategoryName(request.getCategoryName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());

        return menuCategoryRepository.save(category);
    }

    public String deactivateCategory(Integer categoryId) {

        MenuCategory category = menuCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setIsActive(false);
        menuCategoryRepository.save(category);

        return "Category deactivated successfully";
    }

   public String updateCategoryStatus(Integer categoryId, Boolean active) {

    MenuCategory category = menuCategoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException("Category not found"));

    category.setIsActive(active);
    menuCategoryRepository.save(category);

    if (Boolean.TRUE.equals(active)) {
        return "Category activated successfully";
    }

    return "Category deactivated successfully";
}
}