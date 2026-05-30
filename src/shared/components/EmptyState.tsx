interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div
      className="grid gap-1 rounded-[var(--main-page-radius-md)] border border-text/14 p-4 text-left shadow-[var(--main-page-shadow-soft)]"
      style={{
        background: 'linear-gradient(180deg, var(--main-page-surface-soft), var(--main-page-surface))',
      }}
    >
      <div
        aria-hidden="true"
        className="h-9 w-9 text-[var(--main-page-accent-strong)]"
      >
        <svg className="h-full w-full fill-current" viewBox="0 0 24 24">
          <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2h9A2.5 2.5 0 0 1 19 4.5v15A2.5 2.5 0 0 1 16.5 22h-9A2.5 2.5 0 0 1 5 19.5v-15Zm2.5-.5a.5.5 0 0 0-.5.5v15c0 .3.2.5.5.5h9c.3 0 .5-.2.5-.5v-15a.5.5 0 0 0-.5-.5h-9Zm1.5 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Z" />
        </svg>
      </div>
      <h4 className="m-0 text-text">{title}</h4>
      <p className="m-0 text-[var(--main-page-text-soft)]">{description}</p>
    </div>
  );
}
