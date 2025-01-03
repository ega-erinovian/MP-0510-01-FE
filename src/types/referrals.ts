export interface ReferralType {
  id: number;
  referrerUserId: number;
  refereeUserId: number;
  createdAt: string;
  updatedAt: string;
  refereeUser: {
    fullName: string;
    createdAt: string;
  };
}
