package com.dineflow.backend.repository;

import com.dineflow.backend.entity.RestaurantOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import com.dineflow.backend.entity.User;
import java.time.LocalDateTime;
import java.util.List;

public interface RestaurantOrderRepository extends JpaRepository<RestaurantOrder, Integer> {

    Long countByOrderStatus(String orderStatus);

    List<RestaurantOrder> findByOrderStatus(String orderStatus);

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

    List<RestaurantOrder> findByCustomer(User customer);

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
}