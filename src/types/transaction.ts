export interface TransactionType {
  id: number;
  userId: number;
  eventId: number;
  qty: number;
  totalPrice: number;
  paymentProof?: string;
  status: string;
  voucherId?: number;
  couponId?: number;
  createdAt: Date;
  updatedAt: Date;
  isUsePoint: boolean;
  user: {
    fullName: string;
    email: string;
    phoneNumber: string;
    reviews: {
      id: number;
      rating: number;
      comment: string;
      eventId: number;
    }[];
    point: number;
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
    organizer: {
      fullName: string;
      bankAccount: string;
    };
  };
}
