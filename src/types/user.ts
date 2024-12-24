export interface UserType {
  id: number;
  fullName: string;
  email: string;
  password: string;
  profilePicture: string | null;
  referralCode: string | null;
  phoneNumber: string;
  role: string;
  isDeleted: boolean;
  point: number;
  cityId: number;
  pointExpired: Date | null;
  referralsUsed: [];
  createdAt: Date;
  updatedAt: Date;
}
