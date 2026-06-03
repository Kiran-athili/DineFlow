package com.dineflow.backend.controller;

import com.dineflow.backend.dto.MenuItemRequest;
import com.dineflow.backend.entity.MenuItem;
import com.dineflow.backend.service.MenuItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService menuItemService;

    @PostMapping
    public MenuItem createItem(@Valid @RequestBody MenuItemRequest request) {
        return menuItemService.createItem(request);
    }

    @GetMapping
    public List<MenuItem> getAllItems() {
        return menuItemService.getAllItems();
    }

    @GetMapping("/available")
    public List<MenuItem> getAvailableItems() {
        return menuItemService.getAvailableItems();
    }

    @GetMapping("/available/category/{categoryId}")
    public List<MenuItem> getAvailableItemsByCategory(@PathVariable Integer categoryId) {
        return menuItemService.getAvailableItemsByCategory(categoryId);
    }

    @PutMapping("/{itemId}")
    public MenuItem updateItem(
            @PathVariable Integer itemId,
            @Valid @RequestBody MenuItemRequest request
    ) {
        return menuItemService.updateItem(itemId, request);
    }

    @PatchMapping("/{itemId}/availability")
    public String updateAvailability(
            @PathVariable Integer itemId,
            @RequestParam Boolean available
    ) {
        return menuItemService.updateAvailability(itemId, available);
    }
}