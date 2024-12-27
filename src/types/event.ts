export interface EventType {
  id: number;
  title: string;
  description: string;
  price: number;
  availableSeats: number;
  startDate: Date;
  endDate: Date;
  thumbnnail: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  cityId: number;
  organizer: {
    id: number;
    fullName: string;
  };
  city: {
    name: string;
  };
  category: {
    name: string;
  };
}
