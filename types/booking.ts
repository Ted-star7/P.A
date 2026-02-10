// types/booking.ts

// Note: API uses "accomodationType" (double 'm') not "accommodationType"
export interface Booking {
  id: number;
  guestName: string;
  email: string;
  phoneNumber: string;
  accomodationType: string; // Changed from accommodationType
  numberOfGuests: number;
  startDate: string; // Format: "2026-02-10"
  endDate: string; // Format: "2026-02-10"
  totalAmount: number;
  status: string; // API returns string, not specific enum
  bookingType?: 'online' | 'walkin'; // Your custom field
  specialRequests?: string; // Your custom field
  createdAt?: string;
  updatedAt?: string;
}

// For creating bookings - matches API exactly
export interface CreateBookingRequest {
  guestName: string;
  email: string;
  phoneNumber: string;
  accomodationType: string; // Changed from accommodationType
  numberOfGuests: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string; // Just string, not enum
}

// API response structure
export interface BookingResponse {
  message: string;
  data: Booking | Booking[];
}

// Helper type for API compatibility
export interface ApiCreateBookingRequest {
  bookingRequest: CreateBookingRequest;
}