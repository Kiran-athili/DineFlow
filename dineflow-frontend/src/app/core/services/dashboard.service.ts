import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DashboardAnalyticsResponse,
  DashboardResponse
} from '../models/dashboard.model';

import { DashboardSummaryResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly baseUrl = `${environment.apiBaseUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getAdminDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.baseUrl}/admin`);
  }

  getAdminAnalytics(): Observable<DashboardAnalyticsResponse> {
    return this.http.get<DashboardAnalyticsResponse>(`${this.baseUrl}/admin/analytics`);
  }

  getAdminSummary(): Observable<DashboardSummaryResponse> {
  return this.http.get<DashboardSummaryResponse>(`${this.baseUrl}/admin/summary`);
}
}