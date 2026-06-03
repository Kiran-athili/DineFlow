import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateReservationRequest,
  ReservationResponse,
  UpdateReservationStatusRequest
} from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private readonly baseUrl = `${environment.apiBaseUrl}/reservations`;

  constructor(private http: HttpClient) {}

  createReservation(request: CreateReservationRequest): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(this.baseUrl, request);
  }

  getMyReservations(): Observable<ReservationResponse[]> {
    return this.http.get<ReservationResponse[]>(`${this.baseUrl}/my-reservations`);
  }

  getAllReservations(): Observable<ReservationResponse[]> {
    return this.http.get<ReservationResponse[]>(this.baseUrl);
  }

  getReservationsByDate(reservationDate: string): Observable<ReservationResponse[]> {
    return this.http.get<ReservationResponse[]>(
      `${this.baseUrl}/date?reservationDate=${reservationDate}`
    );
  }

  updateReservationStatus(
    reservationId: number,
    request: UpdateReservationStatusRequest
  ): Observable<ReservationResponse> {
    return this.http.patch<ReservationResponse>(
      `${this.baseUrl}/${reservationId}/status`,
      request
    );
  }
}