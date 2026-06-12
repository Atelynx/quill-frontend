import type { PropsWithChildren } from 'react';
import { AppShell } from '../../../shared/layout/AppShell';
import { AdminNav } from '../components/AdminNav';
import { admin } from '../../../shared/content/strings';

export function AdminLayout({ children }: PropsWithChildren) {
  return (
    <AppShell title={admin.title} subtitle={admin.subtitle}>
      <AdminNav />
      <div className="grid gap-[1.2rem]">{children}</div>
    </AppShell>
  );
}
