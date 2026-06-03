import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PaymentResponse } from '../../../core/models/payment.model';
import { PaymentService } from '../../../core/services/payment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payments',
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.html',
  styleUrl: './payments.css'
})
export class Payments implements OnInit {

  payments: PaymentResponse[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  selectedView: 'TODAY' | 'ALL' = 'TODAY';

  fromDate = '';
  toDate = '';
  isDateFilterApplied = false;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
  this.loadTodayPayments();
}

  loadPayments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.paymentService.getAllPayments().subscribe({
      next: (response) => {
        this.payments = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error.error?.message || 'Failed to load payments');
      }
    });
  }

  getTotalRevenue(): number {
    return this.payments.reduce((total, payment) => total + payment.paidAmount, 0);
  }

  getStatusClass(status: string): string {
    if (status === 'SUCCESS') {
      return 'bg-success';
    }

    if (status === 'FAILED') {
      return 'bg-danger';
    }

    if (status === 'PENDING') {
      return 'bg-warning';
    }

    return 'bg-secondary';
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';

    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  filterByDateRange(): void {
  this.errorMessage = '';

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

  this.paymentService.getPaymentsByDateRange(this.fromDate, this.toDate).subscribe({
    next: (response) => {
      this.payments = response;
      this.isLoading = false;
    },
    error: (error) => {
      this.isLoading = false;
      this.showError(error.error?.message || 'Failed to filter payments');
    }
  });
}

clearDateFilter(): void {
  this.fromDate = '';
  this.toDate = '';
  this.isDateFilterApplied = false;
  this.loadPayments();
}

loadTodayPayments(): void {
  this.isLoading = true;
  this.errorMessage = '';
  this.selectedView = 'TODAY';
  this.isDateFilterApplied = false;
  this.fromDate = '';
  this.toDate = '';

  this.paymentService.getTodayPayments().subscribe({
    next: (response) => {
      this.payments = response;
      this.isLoading = false;
    },
    error: (error) => {
      this.isLoading = false;
      this.showError(error.error?.message || 'Failed to load today payments');
    }
  });
}

loadAllPayments(): void {
  this.isLoading = true;
  this.errorMessage = '';
  this.selectedView = 'ALL';
  this.isDateFilterApplied = false;
  this.fromDate = '';
  this.toDate = '';

  this.paymentService.getAllPayments().subscribe({
    next: (response) => {
      this.payments = response;
      this.isLoading = false;
    },
    error: (error) => {
      this.isLoading = false;
      this.showError(error.error?.message || 'Failed to load all payments');
    }
  });
}
}