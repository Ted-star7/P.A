'use client';

import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import { AccommodationsContent } from '@/components/AccommodationsContent';

export default function AccommodationsPage() {
  return (
    <ProtectedPageWrapper title="Accommodations Management">
      <AccommodationsContent />
    </ProtectedPageWrapper>
  );
}
