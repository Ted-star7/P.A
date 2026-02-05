'use client';

import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import { SettingsContent } from '@/components/SettingsContent';

export default function SettingsPage() {
  return (
    <ProtectedPageWrapper title="Settings">
      <SettingsContent />
    </ProtectedPageWrapper>
  );
}
