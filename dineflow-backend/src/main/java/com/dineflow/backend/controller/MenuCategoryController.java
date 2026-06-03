package com.dineflow.backend.controller;

import com.dineflow.backend.dto.MenuCategoryRequest;
import com.dineflow.backend.entity.MenuCategory;
import com.dineflow.backend.service.MenuCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-categories")
@RequiredArgsConstructor
public class MenuCategoryController {

    private final MenuCategoryService menuCategoryService;

    @PostMapping
    public MenuCategory createCategory(@Valid @RequestBody MenuCategoryRequest request) {
        return menuCategoryService.createCategory(request);
    }

    @GetMapping
    public List<MenuCategory> getAllCategories() {
        return menuCategoryService.getAllCategories();
    }

    @GetMapping("/active")
    public List<MenuCategory> getActiveCategories() {
        return menuCategoryService.getActiveCategories();
    }

    @PutMapping("/{categoryId}")
    public MenuCategory updateCategory(
            @PathVariable Integer categoryId,
            @Valid @RequestBody MenuCategoryRequest request
    ) {
        return menuCategoryService.updateCategory(categoryId, request);
    }

    @DeleteMapping("/{categoryId}")
    public String deactivateCategory(@PathVariable Integer categoryId) {
        return menuCategoryService.deactivateCategory(categoryId);
    }
    
@PatchMapping("/{categoryId}/status")
public String updateCategoryStatus(
        @PathVariable Integer categoryId,
        @RequestParam("active") Boolean active
) {
    return menuCategoryService.updateCategoryStatus(categoryId, active);
}
}