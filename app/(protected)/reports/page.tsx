'use client';

import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import { ReportsContent } from '@/components/ReportsContent';

export default function ReportsPage() {
  return (
    <ProtectedPageWrapper title="Reports & Analytics">
      <ReportsContent />
    </ProtectedPageWrapper>
  );
}
