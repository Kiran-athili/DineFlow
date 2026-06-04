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
  todayServedOrders: number;
  todayUnservedOrders: number;

  todayReservations: number;
  todayServedReservations: number;
  todayUnservedReservations: number;

  totalTables: number;
  reservedOrOccupiedTables: number;
  availableTables: number;

  todayTotalBills: number;
  todayPaidBills: number;
  todayUnpaidBills: number;

  totalCustomers: number;
  totalMenuItems: number;
}