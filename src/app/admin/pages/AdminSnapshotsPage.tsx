import { useState } from 'react';
import { useAdminSnapshots, useCreateSnapshot } from '../../../shared/api/hooks';
import { admin } from '../../../shared/content/strings';
import { button, surface, gradient } from '../../../shared/design-system/surfaces';
import { loadingScreen } from '../../../shared/design-system/layout';
import { SectionCard } from '../../../shared/components/SectionCard';
import { SnapshotRestoreDialog } from '../components/SnapshotRestoreDialog';
import type { AdminSnapshot } from '../../../shared/api/validators';

export function AdminSnapshotsPage() {
  const { data: snapshots, isLoading } = useAdminSnapshots();
  const [restoreTarget, setRestoreTarget] = useState<AdminSnapshot | null>(null);
  const [viewTarget, setViewTarget] = useState<AdminSnapshot | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const createMutation = useCreateSnapshot();

  const handleCreate = async () => {
    await createMutation.mutateAsync(createName ? { name: createName } : undefined);
    setShowCreate(false);
    setCreateName('');
  };

  if (isLoading) {
    return <div className={loadingScreen}>Cargando respaldos...</div>;
  }

  return (
    <>
      <SectionCard
        title={admin.snapshots.title}
        description={admin.snapshots.description}
        actions={
          !showCreate ? (
            <button
              type="button"
              className={`${button.base} ${button.primary}`}
              onClick={() => setShowCreate(true)}
            >
              {admin.snapshots.create}
            </button>
          ) : null
        }
      >
        {showCreate ? (
          <div className="mb-4 flex items-end gap-3">
            <label className="flex-1">
              <span className="mb-1 block text-[0.85rem] font-semibold text-[var(--color-text)]">{admin.snapshots.createName}</span>
              <input
                className="w-full rounded-[var(--main-page-radius-md)] border border-[var(--main-page-border)] bg-[var(--main-page-surface-soft)] px-4 py-3 text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-accent)]"
                type="text"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Opcional"
              />
            </label>
            <button
              type="button"
              className={`${button.base} ${button.primary}`}
              onClick={handleCreate}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? admin.actions.creating : admin.snapshots.create}
            </button>
            <button
              type="button"
              className={`${button.base} ${button.secondary}`}
              onClick={() => { setShowCreate(false); setCreateName(''); }}
            >
              {admin.actions.cancel}
            </button>
          </div>
        ) : null}

        {!snapshots?.length ? (
          <p className="text-[var(--main-page-text-soft)]">{admin.snapshots.empty}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {snapshots.map((snapshot) => (
              <article
                key={snapshot._id}
                className={`${gradient.pulseCard} rounded-[var(--main-page-radius-lg)] border border-[var(--main-page-border)] p-5 shadow-[var(--main-page-shadow-soft)]`}
              >
                <strong className="block text-text">{snapshot.name}</strong>
                <span className="block text-[0.85rem] text-[var(--main-page-text-soft)]">
                  {new Date(snapshot.createdAt).toLocaleString('es-CL')}
                </span>
                <span className="mt-1 block text-[0.82rem] text-[var(--main-page-text-muted)]">
                  {Object.keys(snapshot.configs).length} configuraciones
                </span>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="rounded-[var(--main-page-radius-md)] px-3 py-1.5 text-[0.82rem] font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--main-page-accent-soft)]"
                    onClick={() => setViewTarget(snapshot)}
                  >
                    {admin.snapshots.view}
                  </button>
                  <button
                    type="button"
                    className="rounded-[var(--main-page-radius-md)] px-3 py-1.5 text-[0.82rem] font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--main-page-surface-muted)]"
                    onClick={() => setRestoreTarget(snapshot)}
                  >
                    {admin.snapshots.restore}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>

      {restoreTarget ? (
        <SnapshotRestoreDialog snapshot={restoreTarget} onClose={() => setRestoreTarget(null)} />
      ) : null}

      {viewTarget ? (
        <SnapshotViewDialog snapshot={viewTarget} onClose={() => setViewTarget(null)} />
      ) : null}
    </>
  );
}

function SnapshotViewDialog({ snapshot, onClose }: { snapshot: AdminSnapshot; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className={`rounded-[var(--main-page-radius-lg)] shadow-[var(--main-page-shadow)] border border-[var(--main-page-border)] w-full max-w-lg [background:var(--main-page-surface-strong)] p-6`} onClick={(e) => e.stopPropagation()}>
        <h3 className="m-0 mb-1 text-text">{snapshot.name}</h3>
        <span className="block text-[0.85rem] text-[var(--main-page-text-soft)]">
          {new Date(snapshot.createdAt).toLocaleString('es-CL')}
        </span>

        <div className="mt-4 grid gap-2">
          {Object.entries(snapshot.configs).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between rounded-[var(--main-page-radius-md)] border border-[var(--main-page-border)] px-4 py-3">
              <span className="font-mono text-[0.88rem] font-semibold text-text">{key}</span>
              <span className="font-mono text-[0.88rem] text-[var(--main-page-text-soft)]">{String(value)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button type="button" className={`${button.base} ${button.secondary}`} onClick={onClose}>
            {admin.actions.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
