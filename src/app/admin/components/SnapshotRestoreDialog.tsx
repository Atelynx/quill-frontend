import { useRestoreSnapshot } from '../../../shared/api/hooks';
import { admin } from '../../../shared/content/strings';
import { button, surface } from '../../../shared/design-system/surfaces';
import { textSoft } from '../../../shared/design-system/typography';
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
    <div className={surface.modalOverlay} onClick={onClose}>
      <div className={surface.modalContentMd} onClick={(e) => e.stopPropagation()}>
        <h3 className="m-0 mb-2 text-text">{admin.snapshots.restore}</h3>
        <p className={`mb-4 ${textSoft}`}>{admin.snapshots.restoreConfirm}</p>

        <div className={`mb-4 ${surface.innerCard}`}>
          <strong className="block text-text">{snapshot.name}</strong>
          <span className={`text-[0.85rem] ${textSoft}`}>
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
