import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderResponse } from '../../../core/models/order.model';
import { PaymentService } from '../../../core/services/payment.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-my-orders',
  imports: [CommonModule],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrders implements OnInit {

  orders: OrderResponse[] = [];

  isLoading = false;
  payingOrderId: number | null = null;

  errorMessage = '';
  successMessage = '';

  paymentMethods = ['UPI', 'CARD', 'CASH'];

  constructor(
    private orderService: OrderService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadMyOrders();
  }

  loadMyOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getMyOrders().subscribe({
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

  makePayment(order: OrderResponse, paymentMethod: string): void {
    if (!paymentMethod) {
      this.showError('Please select payment method');
      return;
    }

    if (order.orderStatus === 'PAID') {
      this.showError('Order is already paid');
      return;
    }

    if (order.orderStatus === 'CANCELLED') {
      this.showError('Cancelled order cannot be paid');
      return;
    }

    this.payingOrderId = order.orderId;

    this.paymentService.makePayment({
      orderId: order.orderId,
      paymentMethod
    }).subscribe({
      next: (response) => {
        this.payingOrderId = null;
        this.showSuccess(`Payment successful for Order #${response.orderId}`);
        this.loadMyOrders();
      },
      error: (error) => {
        this.payingOrderId = null;
        this.showError(error.error?.message || error.error || 'Payment failed');
      }
    });
  }

  canPay(order: OrderResponse): boolean {
    return order.orderStatus !== 'PAID' && order.orderStatus !== 'CANCELLED';
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