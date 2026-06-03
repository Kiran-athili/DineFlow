import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReservationResponse } from '../../../core/models/reservation.model';
import { ReservationService } from '../../../core/services/reservation.service';

@Component({
  selector: 'app-my-reservations',
  imports: [CommonModule],
  templateUrl: './my-reservations.html',
  styleUrl: './my-reservations.css'
})
export class MyReservations implements OnInit {

  reservations: ReservationResponse[] = [];

  isLoading = false;
  errorMessage = '';

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadMyReservations();
  }

  loadMyReservations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.reservationService.getMyReservations().subscribe({
      next: (response) => {
        this.reservations = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load reservations';
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
}