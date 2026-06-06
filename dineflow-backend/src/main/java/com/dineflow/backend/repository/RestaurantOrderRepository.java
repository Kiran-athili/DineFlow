package com.dineflow.backend.repository;

import com.dineflow.backend.entity.RestaurantOrder;
import com.dineflow.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RestaurantOrderRepository extends JpaRepository<RestaurantOrder, Integer> {

    Long countByOrderStatus(String orderStatus);

    List<RestaurantOrder> findByOrderStatus(String orderStatus);

    List<RestaurantOrder> findByOrderStatusOrderByCreatedAtDesc(String orderStatus);

    List<RestaurantOrder> findByOrderStatusInOrderByCreatedAtDesc(List<String> statuses);

    List<RestaurantOrder> findAllByOrderByCreatedAtDesc();

    List<RestaurantOrder> findByCustomer(User customer);

    List<RestaurantOrder> findByCustomerOrderByCreatedAtDesc(User customer);

    List<RestaurantOrder> findByCustomerEmailOrderByCreatedAtDesc(String email);

    Long countByCreatedAtBetween(
            LocalDateTime fromDate,
            LocalDateTime toDate
    );

    Long countByOrderStatusAndCreatedAtBetween(
            String orderStatus,
            LocalDateTime fromDate,
            LocalDateTime toDate
    );

    Long countByCreatedAtBetweenAndOrderStatusIn(
            LocalDateTime fromDate,
            LocalDateTime toDate,
            List<String> statuses
    );

    Long countByCreatedAtBetweenAndOrderStatusNotIn(
            LocalDateTime fromDate,
            LocalDateTime toDate,
            List<String> statuses
    );

    List<RestaurantOrder> findByCreatedAtBetweenOrderByCreatedAtDesc(
            LocalDateTime fromDate,
            LocalDateTime toDate
    );

    List<RestaurantOrder> findByOrderStatusNotInOrderByCreatedAtDesc(
            List<String> statuses
    );

    List<RestaurantOrder> findByOrderStatusNotInAndCreatedAtBetweenOrderByCreatedAtDesc(
            List<String> statuses,
            LocalDateTime fromDate,
            LocalDateTime toDate
    );
}