export interface ReservationItemRequest {
  itemId: number;
  quantity: number;
}

export interface CreateReservationRequest {
  tableId: number;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  items: ReservationItemRequest[];
}

export interface UpdateReservationStatusRequest {
  reservationStatus: string;
}

export interface ReservationItemResponse {
  reservationItemId: number;
  itemId: number;
  itemName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface ReservationResponse {
  reservationId: number;
  customerName: string;
  customerEmail: string;
  tableNumber: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  reservationStatus: string;
  preorderAmount: number;
  createdAt: string;
  items: ReservationItemResponse[];
}