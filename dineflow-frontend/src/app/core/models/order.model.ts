export interface OrderItemRequest {
  itemId: number;
  quantity: number;
}

export interface PlaceOrderRequest {
  tableId: number;
  items: OrderItemRequest[];
}

export interface OrderItemResponse {
  orderItemId: number;
  itemId: number;
  itemName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface OrderResponse {
  orderId: number;
  customerName: string;
  tableNumber: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface UpdateOrderStatusRequest {
  orderStatus: string;
}