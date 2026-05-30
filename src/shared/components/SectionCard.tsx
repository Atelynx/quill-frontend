import type { PropsWithChildren, ReactNode } from 'react';

interface SectionCardProps extends PropsWithChildren {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function SectionCard({ title, description, actions, children }: SectionCardProps) {
  return (
    <section
      className="rounded-[var(--main-page-radius-xl)] border border-text/14 p-5 shadow-[var(--main-page-shadow)] backdrop-blur-lg"
      style={{
        background: 'linear-gradient(180deg, var(--main-page-surface-strong), var(--main-page-surface))',
      }}
    >
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
