package com.dineflow.backend.service;

import com.dineflow.backend.dto.PaymentRequest;
import com.dineflow.backend.dto.PaymentResponse;
import com.dineflow.backend.entity.Payment;
import com.dineflow.backend.entity.RestaurantOrder;
import com.dineflow.backend.entity.RestaurantTable;
import com.dineflow.backend.repository.PaymentRepository;
import com.dineflow.backend.repository.RestaurantOrderRepository;
import com.dineflow.backend.repository.RestaurantTableRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RestaurantOrderRepository orderRepository;
    private final RestaurantTableRepository tableRepository;

    @Transactional
    public PaymentResponse makePayment(PaymentRequest request, String customerEmail) {

        RestaurantOrder order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getCustomer().getEmail().equals(customerEmail)) {
            throw new RuntimeException("You can pay only for your own order");
        }

        Optional<Payment> existingPayment = paymentRepository.findByOrder(order);

        if (existingPayment.isPresent()) {
            order.setOrderStatus("PAID");
            orderRepository.save(order);

            RestaurantTable table = order.getTable();
            table.setStatus("AVAILABLE");
            tableRepository.save(table);

            return mapToPaymentResponse(existingPayment.get());
        }

        if ("CANCELLED".equals(order.getOrderStatus())) {
            throw new RuntimeException("Payment cannot be made for cancelled order");
        }

        if ("PAID".equals(order.getOrderStatus())) {
            throw new RuntimeException("Order is already paid");
        }

        Payment payment = Payment.builder()
                .order(order)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus("SUCCESS")
                .paidAmount(order.getTotalAmount())
                .paidAt(LocalDateTime.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        order.setOrderStatus("PAID");
        orderRepository.save(order);

        RestaurantTable table = order.getTable();
        table.setStatus("AVAILABLE");
        tableRepository.save(table);

        return mapToPaymentResponse(savedPayment);
    }

    public List<PaymentResponse> getAllPayments() {

        return paymentRepository.findAllByOrderByPaidAtDesc()
                .stream()
                .map(this::mapToPaymentResponse)
                .toList();
    }

    public PaymentResponse getPaymentByOrder(
            Integer orderId,
            String loggedInEmail,
            boolean isAdmin
    ) {

        RestaurantOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!isAdmin && !order.getCustomer().getEmail().equals(loggedInEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can view only your own payment"
            );
        }

        Payment payment = paymentRepository.findByOrder(order)
                .orElseThrow(() -> new RuntimeException("Payment not found for this order"));

        return mapToPaymentResponse(payment);
    }

    public List<PaymentResponse> getPaymentsByDateRange(LocalDate fromDate, LocalDate toDate) {

        LocalDateTime startDateTime = fromDate.atStartOfDay();
        LocalDateTime endDateTime = toDate.atTime(23, 59, 59);

        return paymentRepository
                .findByPaidAtBetweenOrderByPaidAtDesc(startDateTime, endDateTime)
                .stream()
                .map(this::mapToPaymentResponse)
                .toList();
    }

    public List<PaymentResponse> getTodayPayments() {

        LocalDate today = LocalDate.now();

        LocalDateTime startDateTime = today.atStartOfDay();
        LocalDateTime endDateTime = today.atTime(23, 59, 59);

        return paymentRepository
                .findByPaidAtBetweenOrderByPaidAtDesc(startDateTime, endDateTime)
                .stream()
                .map(this::mapToPaymentResponse)
                .toList();
    }

    private PaymentResponse mapToPaymentResponse(Payment payment) {

        return new PaymentResponse(
                payment.getPaymentId(),
                payment.getOrder().getOrderId(),
                payment.getOrder().getCustomer().getFullName(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getPaidAmount(),
                payment.getPaidAt()
        );
    }
}