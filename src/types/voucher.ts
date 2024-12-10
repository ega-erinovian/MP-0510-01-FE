type VoucherType = {
  id: number;
  eventId: number;
  code: string;
  amount: number;
  isUsed: boolean;
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
};
