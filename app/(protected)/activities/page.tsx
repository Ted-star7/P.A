'use client';

import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import { ActivitiesContent } from '@/components/ActivitiesContent';

export default function ActivitiesPage() {
  return (
    <ProtectedPageWrapper title="Activities Management">
      <ActivitiesContent />
    </ProtectedPageWrapper>
  );
}
