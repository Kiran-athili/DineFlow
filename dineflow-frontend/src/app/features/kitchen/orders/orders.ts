import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderResponse } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {

  orders: OrderResponse[] = [];
  isLoading = false;

  errorMessage = '';
  successMessage = '';

  selectedStatus = 'ALL';

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
    this.loadOrders();
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
          this.showError(error.error?.message || 'Failed to load kitchen orders');
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
          this.showError(error.error?.message || 'Failed to load kitchen orders');
        }
      });
    }
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
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

    if (status === 'SERVED' || status === 'PAID') {
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
}