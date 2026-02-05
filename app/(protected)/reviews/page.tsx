'use client';

import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import { ReviewsContent } from '@/components/ReviewsContent';

export default function ReviewsPage() {
  return (
    <ProtectedPageWrapper title="Reviews Management">
      <ReviewsContent />
    </ProtectedPageWrapper>
  );
}
