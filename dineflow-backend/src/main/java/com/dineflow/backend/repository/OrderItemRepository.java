package com.dineflow.backend.repository;

import com.dineflow.backend.entity.OrderItem;
import com.dineflow.backend.entity.RestaurantOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;



public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findByOrder(RestaurantOrder order);

    @Query(value = """
        SELECT 
            mi.item_name AS itemName,
            SUM(oi.quantity) AS totalQuantitySold,
            COALESCE(SUM(oi.quantity * oi.price), 0) AS totalRevenue
        FROM order_items oi
        JOIN menu_items mi ON oi.item_id = mi.item_id
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.order_status <> 'CANCELLED'
        GROUP BY mi.item_id, mi.item_name
        ORDER BY SUM(oi.quantity) DESC
        LIMIT 5
        """, nativeQuery = true)
List<Object[]> getTopSellingDishes();
}