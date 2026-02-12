'use client';

import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import WalkInBookings from '@/components/WalkInBookings';

export default function WalkInBookingPage() {
  return (
    <ProtectedPageWrapper title="Walk-In Booking">
      <WalkInBookings />
    </ProtectedPageWrapper>
  );
}