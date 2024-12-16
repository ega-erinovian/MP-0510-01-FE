export interface TransactionType {
  id: number;
  userId: number;
  eventId: number;
  qty: number;
  totalPrice: number;
  paymentProof?: string;
  status: string;
  voucherId?: string;
  couponId?: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  event: {
    title: string;
    category: {
      id: number;
      name: string;
    };
    price: number;
    availableSeats: number;
    userId: number;
  };
}
