export interface CouponType {
  id: number;
  code: string;
  userId: number;
  amount: number;
  isUsed: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
