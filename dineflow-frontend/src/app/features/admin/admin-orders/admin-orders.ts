import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderResponse } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-orders',
 imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css'
})
export class AdminOrders implements OnInit {

  orders: OrderResponse[] = [];
  isLoading = false;

  errorMessage = '';
  successMessage = '';

  selectedStatus = 'ALL';

  fromDate = '';
  toDate = '';
  isDateFilterApplied = false;

  selectedView: 'TODAY' | 'ALL' | 'PENDING_PAYMENTS' = 'TODAY';

  orderStatuses = [
    'ALL',
    'PLACED',
    'ACCEPTED',
    'PREPARING',
    'READY',
    'SERVED',
    'CANCELLED',
    'PAID'
  ];

  updateStatuses = [
    'ACCEPTED',
    'PREPARING',
    'READY',
    'SERVED',
    'CANCELLED'
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
  this.loadTodayOrders();
}

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.selectedStatus === 'ALL') {
      this.orderService.getAllOrders().subscribe({
        next: (response) => {
          this.orders = response;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.showError(error.error?.message || 'Failed to load orders');
        }
      });
    } else {
      this.orderService.getOrdersByStatus(this.selectedStatus).subscribe({
        next: (response) => {
          this.orders = response;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.showError(error.error?.message || 'Failed to load orders');
        }
      });
    }
  }

  filterByStatus(status: string): void {
  this.selectedStatus = status;
  this.isDateFilterApplied = false;
  this.fromDate = '';
  this.toDate = '';
  this.loadOrders();
}
  updateStatus(order: OrderResponse, status: string): void {
    this.orderService.updateOrderStatus(order.orderId, { orderStatus: status }).subscribe({
      next: (updatedOrder) => {
        this.showSuccess('Order status updated successfully');

        this.orders = this.orders.map(existingOrder =>
          existingOrder.orderId === updatedOrder.orderId ? updatedOrder : existingOrder
        );

        if (this.selectedStatus !== 'ALL' && updatedOrder.orderStatus !== this.selectedStatus) {
          this.orders = this.orders.filter(existingOrder => existingOrder.orderId !== updatedOrder.orderId);
        }
      },
      error: (error) => {
        this.showError(error.error?.message || 'Failed to update order status');
      }
    });
  }

  getStatusClass(status: string): string {
    if (status === 'PLACED') {
      return 'bg-secondary';
    }

    if (status === 'ACCEPTED') {
      return 'bg-primary';
    }

    if (status === 'PREPARING') {
      return 'bg-warning';
    }

    if (status === 'READY') {
      return 'bg-info';
    }

    if (status === 'SERVED') {
      return 'bg-success';
    }

    if (status === 'PAID') {
      return 'bg-success';
    }

    if (status === 'CANCELLED') {
      return 'bg-danger';
    }

    return 'bg-dark';
  }

  canUpdate(order: OrderResponse): boolean {
    return order.orderStatus !== 'PAID' && order.orderStatus !== 'CANCELLED';
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    this.clearMessagesAfterDelay();
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    this.clearMessagesAfterDelay();
  }

  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }

  filterByDateRange(): void {
  this.errorMessage = '';
  this.successMessage = '';

  if (!this.fromDate || !this.toDate) {
    this.showError('Please select both from date and to date');
    return;
  }

  if (this.fromDate > this.toDate) {
    this.showError('From date cannot be greater than to date');
    return;
  }

  this.isLoading = true;
  this.isDateFilterApplied = true;
  this.selectedStatus = 'ALL';

  this.orderService.getOrdersByDateRange(this.fromDate, this.toDate).subscribe({
    next: (response) => {
      this.orders = response;
      this.isLoading = false;
    },
    error: (error) => {
      this.isLoading = false;
      this.showError(error.error?.message || 'Failed to filter orders');
    }
  });
}

clearDateFilter(): void {
  this.fromDate = '';
  this.toDate = '';
  this.isDateFilterApplied = false;
  this.selectedStatus = 'ALL';
  this.loadOrders();
}

loadTodayOrders(): void {
  this.isLoading = true;
  this.errorMessage = '';
  this.selectedView = 'TODAY';
  this.selectedStatus = 'ALL';
  this.isDateFilterApplied = false;
  this.fromDate = '';
  this.toDate = '';

  this.orderService.getTodayOrders().subscribe({
    next: (response) => {
      this.orders = response;
      this.isLoading = false;
    },
    error: (error) => {
      this.isLoading = false;
      this.showError(error.error?.message || 'Failed to load today orders');
    }
  });
}

loadAllOrders(): void {
  this.isLoading = true;
  this.errorMessage = '';
  this.selectedView = 'ALL';
  this.selectedStatus = 'ALL';
  this.isDateFilterApplied = false;
  this.fromDate = '';
  this.toDate = '';

  this.orderService.getAllOrders().subscribe({
    next: (response) => {
      this.orders = response;
      this.isLoading = false;
    },
    error: (error) => {
      this.isLoading = false;
      this.showError(error.error?.message || 'Failed to load all orders');
    }
  });
}

loadPendingPayments(): void {
  this.isLoading = true;
  this.errorMessage = '';
  this.selectedView = 'PENDING_PAYMENTS';
  this.selectedStatus = 'ALL';
  this.isDateFilterApplied = false;
  this.fromDate = '';
  this.toDate = '';

  this.orderService.getPendingPayments().subscribe({
    next: (response) => {
      this.orders = response;
      this.isLoading = false;
    },
    error: (error) => {
      this.isLoading = false;
      this.showError(error.error?.message || 'Failed to load pending payments');
    }
  });
}
}