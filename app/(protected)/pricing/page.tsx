'use client';

import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import { PricingContent } from '@/components/PricingContent';

export default function PricingPage() {
  return (
    <ProtectedPageWrapper title="Pricing Management">
      <PricingContent />
    </ProtectedPageWrapper>
  );
}
