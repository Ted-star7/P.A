'use client';

import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import { GuidesContent } from '@/components/GuidesContent';

export default function GuidesPage() {
  return (
    <ProtectedPageWrapper title="Guides Management">
      <GuidesContent />
    </ProtectedPageWrapper>
  );
}
