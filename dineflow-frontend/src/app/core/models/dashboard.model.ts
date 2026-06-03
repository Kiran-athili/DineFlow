export interface DashboardResponse {
  totalOrders: number;
  totalCustomers: number;
  totalMenuItems: number;
  totalTables: number;
  pendingOrders: number;
  paidOrders: number;
  totalRevenue: number;
}

export interface AnalyticsPointResponse {
  label: string;
  value: number;
}

export interface TopSellingDishResponse {
  itemName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface DashboardAnalyticsResponse {
  dailyRevenue: AnalyticsPointResponse[];
  monthlyRevenue: AnalyticsPointResponse[];
  yearlyRevenue: AnalyticsPointResponse[];

  dailyCustomers: AnalyticsPointResponse[];
  monthlyCustomers: AnalyticsPointResponse[];
  yearlyCustomers: AnalyticsPointResponse[];

  topSellingDishes: TopSellingDishResponse[];
}

export interface DashboardSummaryResponse {
  todayRevenue: number;
  thisMonthRevenue: number;
  totalRevenue: number;

  todayOrders: number;
  thisMonthOrders: number;
  totalOrders: number;

  todayPendingOrders: number;
  totalPendingOrders: number;

  todayPaidOrders: number;
  totalPaidOrders: number;

  todayPendingPayments: number;
  totalPendingPayments: number;

  totalCustomers: number;
  totalMenuItems: number;
  totalTables: number;
}