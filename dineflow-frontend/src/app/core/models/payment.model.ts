export interface PaymentRequest {
  orderId: number;
  paymentMethod: string;
}

export interface PaymentResponse {
  paymentId: number;
  orderId: number;
  customerName: string;
  paymentMethod: string;
  paymentStatus: string;
  paidAmount: number;
  paidAt: string;
}