'use client';

import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import { NotificationsContent } from '@/components/NotificationsContent';

export default function NotificationsPage() {
  return (
    <ProtectedPageWrapper title="Notifications">
      <NotificationsContent />
    </ProtectedPageWrapper>
  );
}
