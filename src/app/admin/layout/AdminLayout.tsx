import type { PropsWithChildren } from 'react';
import { AdminNav } from '../components/AdminNav';
import { admin } from '../../../shared/content/strings';
import { eyebrow } from '../../../shared/design-system/typography';

export function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="p-6 max-[720px]:p-4">
      <header className="mb-5">
        <p className={eyebrow}>{admin.title}</p>
        <h1 className="m-0 text-text">{admin.title}</h1>
      </header>

      <AdminNav />

      <div className="grid gap-[1.2rem]">{children}</div>
    </div>
  );
}
