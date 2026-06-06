package com.dineflow.backend.service;

import com.dineflow.backend.dto.*;
import com.dineflow.backend.entity.*;
import com.dineflow.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final RestaurantOrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final RestaurantTableRepository tableRepository;
    private final MenuItemRepository menuItemRepository;

    public OrderResponse placeOrder(PlaceOrderRequest request, String customerEmail) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        RestaurantTable table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new RuntimeException("Table not found"));

        if (!"AVAILABLE".equals(table.getStatus())) {
            throw new RuntimeException("Selected table is not available");
        }

        RestaurantOrder order = RestaurantOrder.builder()
                .customer(customer)
                .table(table)
                .orderStatus("PLACED")
                .totalAmount(BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .build();

        RestaurantOrder savedOrder = orderRepository.save(order);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {

            MenuItem menuItem = menuItemRepository.findById(itemRequest.getItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));

            if (!menuItem.getIsAvailable()) {
                throw new RuntimeException(menuItem.getItemName() + " is not available");
            }

            BigDecimal itemTotal = menuItem.getPrice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .item(menuItem)
                    .quantity(itemRequest.getQuantity())
                    .price(menuItem.getPrice())
                    .build();

            orderItemRepository.save(orderItem);

            totalAmount = totalAmount.add(itemTotal);
        }

        savedOrder.setTotalAmount(totalAmount);
        orderRepository.save(savedOrder);

        table.setStatus("OCCUPIED");
        tableRepository.save(table);

        return mapToOrderResponse(savedOrder);
    }

    public List<OrderResponse> getMyOrders(String customerEmail) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return orderRepository.findByCustomerOrderByCreatedAtDesc(customer)
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    public List<OrderResponse> getAllOrders() {

        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    public List<OrderResponse> getOrdersByStatus(String status) {

        return orderRepository.findByOrderStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    public OrderResponse updateOrderStatus(Integer orderId, UpdateOrderStatusRequest request) {

        RestaurantOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setOrderStatus(request.getOrderStatus());

        if ("SERVED".equals(request.getOrderStatus()) || "CANCELLED".equals(request.getOrderStatus())) {
            RestaurantTable table = order.getTable();
            table.setStatus("AVAILABLE");
            tableRepository.save(table);
        }

        RestaurantOrder updatedOrder = orderRepository.save(order);

        return mapToOrderResponse(updatedOrder);
    }

    public List<OrderResponse> getOrdersByDateRange(LocalDate fromDate, LocalDate toDate) {

        LocalDateTime startDateTime = fromDate.atStartOfDay();
        LocalDateTime endDateTime = toDate.atTime(23, 59, 59);

        return orderRepository
                .findByCreatedAtBetweenOrderByCreatedAtDesc(startDateTime, endDateTime)
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    public List<OrderResponse> getTodayOrders() {

        LocalDate today = LocalDate.now();

        LocalDateTime startDateTime = today.atStartOfDay();
        LocalDateTime endDateTime = today.atTime(23, 59, 59);

        return orderRepository
                .findByCreatedAtBetweenOrderByCreatedAtDesc(startDateTime, endDateTime)
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    public List<OrderResponse> getPendingPayments() {

        return orderRepository
                .findByOrderStatusNotInOrderByCreatedAtDesc(List.of("PAID", "CANCELLED"))
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    public List<OrderResponse> getTodayPendingPayments() {

        LocalDate today = LocalDate.now();

        LocalDateTime startDateTime = today.atStartOfDay();
        LocalDateTime endDateTime = today.atTime(23, 59, 59);

        return orderRepository
                .findByOrderStatusNotInAndCreatedAtBetweenOrderByCreatedAtDesc(
                        List.of("PAID", "CANCELLED"),
                        startDateTime,
                        endDateTime
                )
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    private OrderResponse mapToOrderResponse(RestaurantOrder order) {

        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);

        List<OrderItemResponse> itemResponses = orderItems.stream()
                .map(item -> new OrderItemResponse(
                        item.getOrderItemId(),
                        item.getItem().getItemId(),
                        item.getItem().getItemName(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                ))
                .toList();

        return new OrderResponse(
                order.getOrderId(),
                order.getCustomer().getFullName(),
                order.getTable().getTableNumber(),
                order.getOrderStatus(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                itemResponses
        );
    }
}