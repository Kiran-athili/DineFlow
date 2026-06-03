import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  OrderResponse,
  PlaceOrderRequest,
  UpdateOrderStatusRequest
} from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly baseUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder(request: PlaceOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.baseUrl, request);
  }

  getAllOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.baseUrl);
  }

  getMyOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.baseUrl}/my-orders`);
  }

  getOrdersByStatus(status: string): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.baseUrl}/status/${status}`);
  }

  updateOrderStatus(orderId: number, request: UpdateOrderStatusRequest): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.baseUrl}/${orderId}/status`, request);
  }

  getOrdersByDateRange(fromDate: string, toDate: string): Observable<OrderResponse[]> {
  return this.http.get<OrderResponse[]>(
    `${this.baseUrl}/filter?fromDate=${fromDate}&toDate=${toDate}`
  );
}

getTodayOrders(): Observable<OrderResponse[]> {
  return this.http.get<OrderResponse[]>(`${this.baseUrl}/today`);
}

getPendingPayments(): Observable<OrderResponse[]> {
  return this.http.get<OrderResponse[]>(`${this.baseUrl}/pending-payments`);
}

getTodayPendingPayments(): Observable<OrderResponse[]> {
  return this.http.get<OrderResponse[]>(`${this.baseUrl}/pending-payments/today`);
}
}