import type { PropsWithChildren, ReactNode } from 'react';
import { surface, gradient } from '../design-system/surfaces';

interface SectionCardProps extends PropsWithChildren {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function SectionCard({ title, description, actions, children }: SectionCardProps) {
  return (
    <section className={`${surface.xl} ${gradient.card} p-5`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="m-0 text-text">{title}</h3>
          {description ? <p className="m-0 text-[var(--main-page-text-soft)]">{description}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
