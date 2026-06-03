import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentRequest, PaymentResponse } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly baseUrl = `${environment.apiBaseUrl}/payments`;

  constructor(private http: HttpClient) {}

  makePayment(request: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(this.baseUrl, request);
  }

  getAllPayments(): Observable<PaymentResponse[]> {
    return this.http.get<PaymentResponse[]>(this.baseUrl);
  }

  getPaymentByOrder(orderId: number): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.baseUrl}/order/${orderId}`);
  }

  getPaymentsByDateRange(fromDate: string, toDate: string): Observable<PaymentResponse[]> {
  return this.http.get<PaymentResponse[]>(
    `${this.baseUrl}/filter?fromDate=${fromDate}&toDate=${toDate}`
  );
}

getTodayPayments(): Observable<PaymentResponse[]> {
  return this.http.get<PaymentResponse[]>(`${this.baseUrl}/today`);
}
}