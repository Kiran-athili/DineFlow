export interface RestaurantTable {
  tableId: number;
  tableNumber: string;
  capacity: number;
  status: string;
  createdAt: string;
}

export interface RestaurantTableRequest {
  tableNumber: string;
  capacity: number;
}

export interface UpdateTableStatusRequest {
  status: string;
}