import { useAdminConfigHistory } from '../../../shared/api/hooks';
import { admin } from '../../../shared/content/strings';
import { button, surface } from '../../../shared/design-system/surfaces';
import { hint } from '../../../shared/design-system/typography';

interface ConfigHistoryViewProps {
  keyName: string;
  onClose: () => void;
}

export function ConfigHistoryView({ keyName, onClose }: ConfigHistoryViewProps) {
  const { data: history, isLoading } = useAdminConfigHistory(keyName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className={`${surface.lg} ${'w-full max-w-2xl'} bg-[var(--gradient-card-surface)] p-6 max-h-[80vh] flex flex-col`} onClick={(e) => e.stopPropagation()}>
        <h3 className="m-0 mb-4 text-text">{admin.config.history} — {keyName}</h3>

        <div className="overflow-y-auto flex-1">
          {isLoading ? (
            <p className={hint}>Cargando...</p>
          ) : !history?.length ? (
            <p className={hint}>Sin historial disponible.</p>
          ) : (
            <div className="grid gap-3">
              {history.map((entry, index) => (
                <div key={entry._id ?? index} className="rounded-[var(--main-page-radius-md)] border border-[var(--main-page-border)] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-semibold text-text">{String(entry.value)}</span>
                      {entry.name ? (
                        <p className="m-0 text-[0.85rem] text-[var(--main-page-text-soft)]">{entry.name}</p>
                      ) : null}
                    </div>
                    <div className="text-right text-[0.82rem] text-[var(--main-page-text-muted)]">
                      <p className="m-0">{new Date(entry.updatedAt).toLocaleString('es-CL')}</p>
                      <p className="m-0">{entry.inUse ? admin.config.tags.active : admin.config.tags.inactive}</p>
                    </div>
                  </div>
                  {entry.tags?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-[var(--main-page-surface-muted)] px-2.5 py-0.5 text-[0.78rem] text-[var(--main-page-text-soft)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
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
