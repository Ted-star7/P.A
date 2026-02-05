'use client';

import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import { PaymentsContent } from '@/components/PaymentsContent';

export default function PaymentsPage() {
  return (
    <ProtectedPageWrapper title="Payments Management">
      <PaymentsContent />
    </ProtectedPageWrapper>
  );
}
