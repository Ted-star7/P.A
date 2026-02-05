'use client';

import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import { BookingsContent } from '@/components/BookingsContent';

export default function BookingsPage() {
  return (
    <ProtectedPageWrapper title="Bookings Management">
      <BookingsContent />
    </ProtectedPageWrapper>
  );
}
