import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationResponse } from '../../../core/models/reservation.model';
import { ReservationService } from '../../../core/services/reservation.service';

@Component({
  selector: 'app-reservations',
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css'
})
export class Reservations implements OnInit {

  reservations: ReservationResponse[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  selectedDate = '';
  selectedView: 'TODAY' | 'ALL' | 'DATE' = 'TODAY';

  statuses = ['BOOKED', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadTodayReservations();
  }

  loadTodayReservations(): void {
    const today = new Date().toISOString().slice(0, 10);

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedView = 'TODAY';
    this.selectedDate = today;

    this.reservationService.getReservationsByDate(today).subscribe({
      next: (response) => {
        this.reservations = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error.error?.message || 'Failed to load today reservations');
      }
    });
  }

  loadAllReservations(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedView = 'ALL';
    this.selectedDate = '';

    this.reservationService.getAllReservations().subscribe({
      next: (response) => {
        this.reservations = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error.error?.message || 'Failed to load reservations');
      }
    });
  }

  searchByDate(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedDate) {
      this.showError('Please select reservation date');
      return;
    }

    this.isLoading = true;
    this.selectedView = 'DATE';

    this.reservationService.getReservationsByDate(this.selectedDate).subscribe({
      next: (response) => {
        this.reservations = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showError(error.error?.message || 'Failed to search reservations');
      }
    });
  }

  updateStatus(reservation: ReservationResponse, status: string): void {
    if (reservation.reservationStatus === status) {
      return;
    }

    this.reservationService.updateReservationStatus(reservation.reservationId, {
      reservationStatus: status
    }).subscribe({
      next: () => {
        this.showSuccess('Reservation status updated successfully');

        if (this.selectedView === 'TODAY') {
          this.loadTodayReservations();
        } else if (this.selectedView === 'DATE' && this.selectedDate) {
          this.searchByDate();
        } else {
          this.loadAllReservations();
        }
      },
      error: (error) => {
        this.showError(error.error?.message || 'Failed to update reservation status');
      }
    });
  }

  getStatusClass(status: string): string {
    if (status === 'BOOKED') {
      return 'bg-primary';
    }

    if (status === 'CONFIRMED') {
      return 'bg-success';
    }

    if (status === 'COMPLETED') {
      return 'bg-dark';
    }

    if (status === 'CANCELLED') {
      return 'bg-danger';
    }

    return 'bg-secondary';
  }

  getTotalPreorderAmount(): number {
    return this.reservations.reduce(
      (total, reservation) => total + Number(reservation.preorderAmount || 0),
      0
    );
  }

  getSummaryTitle(): string {
    if (this.selectedView === 'TODAY') {
      return 'Today Reservations';
    }

    if (this.selectedView === 'DATE') {
      return 'Selected Date Reservations';
    }

    return 'Total Reservations';
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