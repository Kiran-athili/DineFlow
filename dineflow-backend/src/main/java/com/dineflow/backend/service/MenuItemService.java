package com.dineflow.backend.service;

import com.dineflow.backend.dto.MenuItemRequest;
import com.dineflow.backend.entity.MenuCategory;
import com.dineflow.backend.entity.MenuItem;
import com.dineflow.backend.repository.MenuCategoryRepository;
import com.dineflow.backend.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final MenuCategoryRepository menuCategoryRepository;

    public MenuItem createItem(MenuItemRequest request) {

        MenuCategory category = menuCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        MenuItem item = MenuItem.builder()
                .itemName(request.getItemName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .videoUrl(request.getVideoUrl())
                .isAvailable(true)
                .category(category)
                .build();

        return menuItemRepository.save(item);
    }

    public List<MenuItem> getAllItems() {
        return menuItemRepository.findAll();
    }

    public List<MenuItem> getAvailableItems() {
        return menuItemRepository.findByIsAvailableTrue();
    }

    public List<MenuItem> getAvailableItemsByCategory(Integer categoryId) {
        return menuItemRepository.findByCategoryCategoryIdAndIsAvailableTrue(categoryId);
    }

    public MenuItem updateItem(Integer itemId, MenuItemRequest request) {

        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        MenuCategory category = menuCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        item.setItemName(request.getItemName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setVideoUrl(request.getVideoUrl());
        item.setCategory(category);

        return menuItemRepository.save(item);
    }

    public String updateAvailability(Integer itemId, Boolean available) {

        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        item.setIsAvailable(available);
        menuItemRepository.save(item);

        return "Menu item availability updated successfully";
    }
}