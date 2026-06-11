import { useRestoreSnapshot } from '../../../shared/api/hooks';
import { admin } from '../../../shared/content/strings';
import { button } from '../../../shared/design-system/surfaces';
import type { AdminSnapshot } from '../../../shared/api/validators';

interface SnapshotRestoreDialogProps {
  snapshot: AdminSnapshot;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SnapshotRestoreDialog({ snapshot, onClose, onSuccess }: SnapshotRestoreDialogProps) {
  const restoreMutation = useRestoreSnapshot();

  const handleRestore = async () => {
    await restoreMutation.mutateAsync(snapshot._id);
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className={`rounded-[var(--main-page-radius-lg)] shadow-[var(--main-page-shadow)] border border-[var(--main-page-border)] w-full max-w-md [background:var(--main-page-surface-strong)] p-6`} onClick={(e) => e.stopPropagation()}>
        <h3 className="m-0 mb-2 text-text">{admin.snapshots.restore}</h3>
        <p className="mb-4 text-[var(--main-page-text-soft)]">{admin.snapshots.restoreConfirm}</p>

        <div className="mb-4 rounded-[var(--main-page-radius-md)] border border-[var(--main-page-border)] p-4">
          <strong className="block text-text">{snapshot.name}</strong>
          <span className="text-[0.85rem] text-[var(--main-page-text-soft)]">
            {new Date(snapshot.createdAt).toLocaleString('es-CL')}
          </span>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" className={`${button.base} ${button.secondary}`} onClick={onClose}>
            {admin.actions.cancel}
          </button>
          <button
            type="button"
            className={`${button.base} ${button.primary}`}
            onClick={handleRestore}
            disabled={restoreMutation.isPending}
          >
            {restoreMutation.isPending ? admin.actions.saving : admin.snapshots.restore}
          </button>
        </div>
      </div>
    </div>
  );
}
