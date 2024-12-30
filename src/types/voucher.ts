export interface VoucherType {
  id: number;
  eventId: number;
  code: string;
  amount: number;
  isUsed: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  event: {
    id: number;
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
