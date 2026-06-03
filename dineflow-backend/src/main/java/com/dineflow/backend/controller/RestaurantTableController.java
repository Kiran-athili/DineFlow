package com.dineflow.backend.controller;

import com.dineflow.backend.dto.RestaurantTableRequest;
import com.dineflow.backend.dto.UpdateTableStatusRequest;
import com.dineflow.backend.entity.RestaurantTable;
import com.dineflow.backend.service.RestaurantTableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class RestaurantTableController {

    private final RestaurantTableService restaurantTableService;

    @PostMapping
    public RestaurantTable createTable(@Valid @RequestBody RestaurantTableRequest request) {
        return restaurantTableService.createTable(request);
    }

    @GetMapping
    public List<RestaurantTable> getAllTables() {
        return restaurantTableService.getAllTables();
    }

    @GetMapping("/available")
    public List<RestaurantTable> getAvailableTables() {
        return restaurantTableService.getAvailableTables();
    }

    @PutMapping("/{tableId}")
    public RestaurantTable updateTable(
            @PathVariable Integer tableId,
            @Valid @RequestBody RestaurantTableRequest request
    ) {
        return restaurantTableService.updateTable(tableId, request);
    }

    @PatchMapping("/{tableId}/status")
    public RestaurantTable updateTableStatus(
            @PathVariable Integer tableId,
            @Valid @RequestBody UpdateTableStatusRequest request
    ) {
        return restaurantTableService.updateTableStatus(tableId, request);
    }

    @DeleteMapping("/{tableId}")
    public String deleteTable(@PathVariable Integer tableId) {
        return restaurantTableService.deleteTable(tableId);
    }
}