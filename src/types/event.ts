export interface EventType {
  id: number;
  title: string;
  description: string;
  price: number;
  availableSeats: number;
  startDate: Date;
  endDate: Date;
  thumbnnail: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  cityId: number;
  organizer: {
    id: number;
    fullName: string;
    profilePicture: string;
    bankAccount: string;
  };
  city: {
    name: string;
    countryId: number;
  };
  category: {
    name: string;
  };
}
