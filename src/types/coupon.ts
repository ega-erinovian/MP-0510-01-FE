export interface CouponType {
  id: number;
  code: string;
  userId: number;
  amount: number;
  isUsed: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
