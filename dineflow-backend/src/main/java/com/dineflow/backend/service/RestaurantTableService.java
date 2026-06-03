package com.dineflow.backend.service;

import com.dineflow.backend.dto.RestaurantTableRequest;
import com.dineflow.backend.dto.UpdateTableStatusRequest;
import com.dineflow.backend.entity.RestaurantTable;
import com.dineflow.backend.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantTableService {

    private final RestaurantTableRepository restaurantTableRepository;

    public RestaurantTable createTable(RestaurantTableRequest request) {

        if (restaurantTableRepository.existsByTableNumber(request.getTableNumber())) {
            throw new RuntimeException("Table number already exists");
        }

        RestaurantTable table = RestaurantTable.builder()
                .tableNumber(request.getTableNumber())
                .capacity(request.getCapacity())
                .status("AVAILABLE")
                .createdAt(LocalDateTime.now())
                .build();

        return restaurantTableRepository.save(table);
    }

    public List<RestaurantTable> getAllTables() {
        return restaurantTableRepository.findAll();
    }

    public List<RestaurantTable> getAvailableTables() {
        return restaurantTableRepository.findByStatus("AVAILABLE");
    }

    public RestaurantTable updateTable(Integer tableId, RestaurantTableRequest request) {

        RestaurantTable table = restaurantTableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        table.setTableNumber(request.getTableNumber());
        table.setCapacity(request.getCapacity());

        return restaurantTableRepository.save(table);
    }

    public RestaurantTable updateTableStatus(Integer tableId, UpdateTableStatusRequest request) {

        RestaurantTable table = restaurantTableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        table.setStatus(request.getStatus());

        return restaurantTableRepository.save(table);
    }

    public String deleteTable(Integer tableId) {

        RestaurantTable table = restaurantTableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        restaurantTableRepository.delete(table);

        return "Table deleted successfully";
    }
}