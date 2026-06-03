import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RestaurantTable,
  RestaurantTableRequest,
  UpdateTableStatusRequest
} from '../models/table.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private readonly baseUrl = `${environment.apiBaseUrl}/tables`;

  constructor(private http: HttpClient) {}

  createTable(request: RestaurantTableRequest): Observable<RestaurantTable> {
    return this.http.post<RestaurantTable>(this.baseUrl, request);
  }

  getAllTables(): Observable<RestaurantTable[]> {
    return this.http.get<RestaurantTable[]>(this.baseUrl);
  }

  getAvailableTables(): Observable<RestaurantTable[]> {
    return this.http.get<RestaurantTable[]>(`${this.baseUrl}/available`);
  }

  updateTable(tableId: number, request: RestaurantTableRequest): Observable<RestaurantTable> {
    return this.http.put<RestaurantTable>(`${this.baseUrl}/${tableId}`, request);
  }

  updateTableStatus(tableId: number, request: UpdateTableStatusRequest): Observable<RestaurantTable> {
    return this.http.patch<RestaurantTable>(`${this.baseUrl}/${tableId}/status`, request);
  }

  deleteTable(tableId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${tableId}`, {
      responseType: 'text'
    });
  }
}