import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AnalyticsPointResponse,
  DashboardAnalyticsResponse,
  DashboardSummaryResponse
} from '../../../core/models/dashboard.model';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  summary?: DashboardSummaryResponse;
  analytics?: DashboardAnalyticsResponse;

  isLoading = false;
  errorMessage = '';

  selectedRevenueView: 'DAILY' | 'MONTHLY' | 'YEARLY' = 'DAILY';
  selectedCustomerView: 'DAILY' | 'MONTHLY' | 'YEARLY' = 'DAILY';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getAdminSummary().subscribe({
      next: (response) => {
        this.summary = response;
        this.loadAnalytics();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load dashboard summary';
      }
    });
  }

  loadAnalytics(): void {
    this.dashboardService.getAdminAnalytics().subscribe({
      next: (response) => {
        this.analytics = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load analytics';
      }
    });
  }

  getRevenueChartData(): AnalyticsPointResponse[] {
    if (!this.analytics) {
      return [];
    }

    if (this.selectedRevenueView === 'MONTHLY') {
      return this.analytics.monthlyRevenue;
    }

    if (this.selectedRevenueView === 'YEARLY') {
      return this.analytics.yearlyRevenue;
    }

    return this.analytics.dailyRevenue;
  }

  getCustomerChartData(): AnalyticsPointResponse[] {
    if (!this.analytics) {
      return [];
    }

    if (this.selectedCustomerView === 'MONTHLY') {
      return this.analytics.monthlyCustomers;
    }

    if (this.selectedCustomerView === 'YEARLY') {
      return this.analytics.yearlyCustomers;
    }

    return this.analytics.dailyCustomers;
  }

  getMaxValue(points: AnalyticsPointResponse[]): number {
    if (!points || points.length === 0) {
      return 1;
    }

    const max = Math.max(...points.map(point => Number(point.value)));

    return max > 0 ? max : 1;
  }

  getBarHeight(value: number, points: AnalyticsPointResponse[]): number {
    const max = this.getMaxValue(points);

    return Math.max((Number(value) / max) * 160, 8);
  }

  getShortLabel(label: string): string {
    if (!label) {
      return '';
    }

    if (label.length === 10) {
      return label.slice(5);
    }

    return label;
  }

  getTotalDishQuantity(): number {
    return this.analytics?.topSellingDishes.reduce(
      (total, dish) => total + dish.totalQuantitySold,
      0
    ) ?? 0;
  }

  getDishPercentage(quantity: number): number {
    const total = this.getTotalDishQuantity();

    if (total === 0) {
      return 0;
    }

    return Math.round((quantity / total) * 100);
  }
}