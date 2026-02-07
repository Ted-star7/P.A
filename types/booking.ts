// types/booking.ts

export interface Booking {
  id: number;
  guestName: string;
  email: string;
  phoneNumber: string;
  accommodationType: string;
  numberOfGuests: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'checked_in' | 'checked_out';
  bookingType: 'online' | 'walkin';
  specialRequests?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingRequest {
  guestName: string;
  email: string;
  phoneNumber: string;
  accommodationType: string;
  numberOfGuests: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'checked_in' | 'checked_out';
  bookingType?: 'online' | 'walkin';
  specialRequests?: string;
}

export interface BookingResponse {
  message: string;
  data: Booking | Booking[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}