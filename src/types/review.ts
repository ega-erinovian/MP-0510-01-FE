export interface ReviewType {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  eventId: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  event: {
    title: string;
    category: { id: number; name: string };
    userId: number; // organizer
  };
}
