import { useState } from 'react';
import { useAdminConfigs, useDeleteAdminConfig } from '../../../shared/api/hooks';
import { admin } from '../../../shared/content/strings';
import { button, surface } from '../../../shared/design-system/surfaces';
import { loadingScreen } from '../../../shared/design-system/layout';
import { SectionCard } from '../../../shared/components/SectionCard';
import { ConfigEditModal } from '../components/ConfigEditModal';
import { ConfigCreateForm } from '../components/ConfigCreateForm';
import { ConfigHistoryView } from '../components/ConfigHistoryView';
import type { AdminConfig } from '../../../shared/api/validators';

export function AdminConfigPage() {
  const { data: configs, isLoading } = useAdminConfigs();
  const [editTarget, setEditTarget] = useState<AdminConfig | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [historyTarget, setHistoryTarget] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminConfig | null>(null);

  if (isLoading) {
    return <div className={loadingScreen}>Cargando configuraciones...</div>;
  }

  return (
    <>
      <SectionCard
        title={admin.config.title}
        description={admin.config.description}
        actions={
          <button
            type="button"
            className={`${button.base} ${button.primary}`}
            onClick={() => setShowCreate(true)}
          >
            {admin.config.create}
          </button>
        }
      >
        <div className={`${surface.tableWrapper}`}>
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{admin.config.fields.key}</th>
                <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{admin.config.fields.name}</th>
                <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{admin.config.fields.value}</th>
                <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{admin.config.fields.status}</th>
                <th className="p-[0.85rem_0.75rem] text-left text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{admin.config.fields.lastUsed}</th>
                <th className="p-[0.85rem_0.75rem] text-right text-[0.86rem] font-semibold text-[var(--main-page-text-soft)]">{admin.config.fields.actions}</th>
              </tr>
            </thead>
            <tbody>
              {!configs?.length ? (
                <tr>
                  <td colSpan={6} className="p-[0.85rem_0.75rem] text-center text-[var(--main-page-text-soft)]">{admin.config.empty}</td>
                </tr>
              ) : (
                configs.map((cfg) => (
                  <tr key={cfg.key} className="border-b border-[var(--main-page-border)] transition-colors">
                    <td className="p-[0.85rem_0.75rem] font-mono text-[0.88rem] font-semibold text-text">
                      {cfg.key}
                      {cfg.appliesOn === 'restart' ? (
                        <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[0.7rem] font-medium text-amber-600">
                          {admin.config.restartWarning}
                        </span>
                      ) : null}
                    </td>
                    <td className="p-[0.85rem_0.75rem] text-text">{cfg.name ?? '—'}</td>
                    <td className="p-[0.85rem_0.75rem] font-mono text-[0.88rem] text-text">
                      <span>{String(cfg.value)}</span>
                      {cfg.appliesOn === 'restart' && cfg.effectiveValue !== undefined &&
                       String(cfg.value) !== String(cfg.effectiveValue) ? (
                        <span className="ml-2 text-[0.75rem] text-[var(--main-page-text-muted)]">
                          ({admin.config.fields.effectiveValue}: {String(cfg.effectiveValue)})
                        </span>
                      ) : null}
                    </td>
                    <td className="p-[0.85rem_0.75rem]">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.78rem] font-medium ${cfg.inUse ? 'bg-[var(--main-page-accent-soft)] text-[var(--main-page-accent-strong)]' : 'bg-[var(--main-page-surface-muted)] text-[var(--main-page-text-muted)]'}`}>
                        {cfg.inUse ? admin.config.tags.active : admin.config.tags.inactive}
                      </span>
                    </td>
                    <td className="p-[0.85rem_0.75rem] text-[0.85rem] text-[var(--main-page-text-soft)]">
                      {cfg.lastUsedAt ? new Date(cfg.lastUsedAt).toLocaleString('es-CL') : '—'}
                    </td>
                    <td className="p-[0.85rem_0.75rem] text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-[var(--main-page-radius-md)] px-3 py-1.5 text-[0.82rem] font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--main-page-accent-soft)]"
                          onClick={() => setEditTarget(cfg)}
                        >
                          {admin.actions.edit}
                        </button>
                        <button
                          type="button"
                          className="rounded-[var(--main-page-radius-md)] px-3 py-1.5 text-[0.82rem] font-medium text-[var(--main-page-text-soft)] transition-colors hover:bg-[var(--main-page-surface-muted)]"
                          onClick={() => setHistoryTarget(cfg.key)}
                        >
                          {admin.actions.history}
                        </button>
                        <button
                          type="button"
                          className="rounded-[var(--main-page-radius-md)] px-3 py-1.5 text-[0.82rem] font-medium text-[var(--main-page-danger)] transition-colors hover:bg-[var(--main-page-danger)]/10"
                          onClick={() => setDeleteTarget(cfg)}
                        >
                          {admin.actions.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {editTarget ? (
        <ConfigEditModal config={editTarget} onClose={() => setEditTarget(null)} />
      ) : null}

      {showCreate ? (
        <ConfigCreateForm onClose={() => setShowCreate(false)} />
      ) : null}

      {historyTarget ? (
        <ConfigHistoryView keyName={historyTarget} onClose={() => setHistoryTarget(null)} />
      ) : null}

      {deleteTarget ? (
        <DeleteConfirmDialog
          configKey={deleteTarget.key}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </>
  );
}

function DeleteConfirmDialog({ configKey, onClose }: { configKey: string; onClose: () => void }) {
  const mutation = useDeleteAdminConfig();

  const handleDelete = async () => {
    await mutation.mutateAsync(configKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className={`rounded-[var(--main-page-radius-lg)] shadow-[var(--main-page-shadow)] border border-[var(--main-page-border)] w-full max-w-md [background:var(--main-page-surface-strong)] p-6`} onClick={(e) => e.stopPropagation()}>
        <h3 className="m-0 mb-2 text-text">{admin.config.delete}</h3>
        <p className="mb-4 text-[var(--main-page-text-soft)]">{admin.config.deleteConfirm}</p>

        <div className="mb-4 rounded-[var(--main-page-radius-md)] border border-[var(--main-page-border)] p-4">
          <strong className="font-mono text-text">{configKey}</strong>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" className={`${button.base} ${button.secondary}`} onClick={onClose}>
            {admin.actions.cancel}
          </button>
          <button
            type="button"
            className={`${button.base} ${button.primary}`}
            style={{ background: 'var(--main-page-danger)', borderColor: 'transparent' }}
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? admin.actions.saving : admin.actions.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
