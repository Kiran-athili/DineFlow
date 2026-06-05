package com.dineflow.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dineflow.backend.dto.AvailableTableResponse;
import com.dineflow.backend.dto.CreateReservationRequest;
import com.dineflow.backend.dto.ReservationItemRequest;
import com.dineflow.backend.dto.ReservationItemResponse;
import com.dineflow.backend.dto.ReservationResponse;
import com.dineflow.backend.dto.UpdateReservationStatusRequest;
import com.dineflow.backend.entity.MenuItem;
import com.dineflow.backend.entity.ReservationItem;
import com.dineflow.backend.entity.RestaurantTable;
import com.dineflow.backend.entity.TableReservation;
import com.dineflow.backend.entity.User;
import com.dineflow.backend.repository.MenuItemRepository;
import com.dineflow.backend.repository.ReservationItemRepository;
import com.dineflow.backend.repository.RestaurantTableRepository;
import com.dineflow.backend.repository.TableReservationRepository;
import com.dineflow.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final TableReservationRepository reservationRepository;
    private final ReservationItemRepository reservationItemRepository;
    private final UserRepository userRepository;
    private final RestaurantTableRepository tableRepository;
    private final MenuItemRepository menuItemRepository;

    @Transactional
    public ReservationResponse createReservation(CreateReservationRequest request, String customerEmail) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        RestaurantTable table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new RuntimeException("Table not found"));

        LocalDateTime reservationDateTime = LocalDateTime.of(
                request.getReservationDate(),
                request.getReservationTime()
        );

        if (reservationDateTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reservation date and time must be in the future");
        }

        if (request.getGuestCount() > table.getCapacity()) {
            throw new RuntimeException("Guest count exceeds table capacity");
        }

        boolean alreadyBooked = reservationRepository
                .existsByRestaurantTableAndReservationDateAndReservationTimeAndReservationStatusIn(
                        table,
                        request.getReservationDate(),
                        request.getReservationTime(),
                        List.of("BOOKED", "CONFIRMED")
                );

        if (alreadyBooked) {
            throw new RuntimeException("This table is already booked for selected date and time");
        }

        TableReservation reservation = TableReservation.builder()
                .customer(customer)
                .restaurantTable(table)
                .reservationDate(request.getReservationDate())
                .reservationTime(request.getReservationTime())
                .guestCount(request.getGuestCount())
                .reservationStatus("BOOKED")
                .preorderAmount(BigDecimal.ZERO)
                .build();

        TableReservation savedReservation = reservationRepository.save(reservation);

        BigDecimal preorderAmount = BigDecimal.ZERO;

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (ReservationItemRequest itemRequest : request.getItems()) {
                MenuItem menuItem = menuItemRepository.findById(itemRequest.getItemId())
                        .orElseThrow(() -> new RuntimeException("Menu item not found"));

                ReservationItem reservationItem = ReservationItem.builder()
                        .reservation(savedReservation)
                        .item(menuItem)
                        .quantity(itemRequest.getQuantity())
                        .price(menuItem.getPrice())
                        .build();

                reservationItemRepository.save(reservationItem);

                preorderAmount = preorderAmount.add(
                        menuItem.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()))
                );
            }
        }

        savedReservation.setPreorderAmount(preorderAmount);
        TableReservation updatedReservation = reservationRepository.save(savedReservation);

        return mapToResponse(updatedReservation);
    }

    @Transactional
    public List<ReservationResponse> getMyReservations(String customerEmail) {
        return reservationRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Transactional
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public List<ReservationResponse> getReservationsByDate(java.time.LocalDate reservationDate) {
        return reservationRepository.findByReservationDateOrderByReservationTimeAsc(reservationDate)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ReservationResponse updateReservationStatus(Integer reservationId, UpdateReservationStatusRequest request) {

        TableReservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        String status = request.getReservationStatus().toUpperCase();

        if (!List.of("BOOKED", "CONFIRMED", "CANCELLED", "COMPLETED").contains(status)) {
            throw new RuntimeException("Invalid reservation status");
        }

        reservation.setReservationStatus(status);

        return mapToResponse(reservationRepository.save(reservation));
    }

    private ReservationResponse mapToResponse(TableReservation reservation) {

        List<ReservationItemResponse> itemResponses = reservationItemRepository
                .findByReservation(reservation)
                .stream()
                .map(item -> new ReservationItemResponse(
                        item.getReservationItemId(),
                        item.getItem().getItemId(),
                        item.getItem().getItemName(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                ))
                .toList();

        return new ReservationResponse(
                reservation.getReservationId(),
                reservation.getCustomer().getFullName(),
                reservation.getCustomer().getEmail(),
                reservation.getRestaurantTable().getTableNumber(),
                reservation.getReservationDate(),
                reservation.getReservationTime(),
                reservation.getGuestCount(),
                reservation.getReservationStatus(),
                reservation.getPreorderAmount(),
                reservation.getCreatedAt(),
                itemResponses
        );
    }

    public List<AvailableTableResponse> getAvailableTablesForReservation(
        LocalDate reservationDate,
        LocalTime reservationTime,
        Integer guestCount
) {
    return tableRepository.findAvailableTablesForReservation(
            reservationDate,
            reservationTime,
            guestCount
    ).stream().map(table -> new AvailableTableResponse(
            table.getTableId(),
            table.getTableNumber(),
            table.getCapacity(),
            table.getStatus()
    )).toList();
}
}