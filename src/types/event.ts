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
  organizer: {
    id: number;
    fullName: string;
  };
  city: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
}
