import { useState, useEffect } from 'react';
import { admin } from '../../../shared/content/strings';
import { button } from '../../../shared/design-system/surfaces';
import { fieldLabel } from '../../../shared/design-system/typography';
import { fieldGroup } from '../../../shared/design-system/layout';
import { inputBase } from '../../../shared/design-system/forms';
import { useCreateAdminConfig } from '../../../shared/api/hooks';

interface ConfigCreateFormProps {
  onClose: () => void;
}

export function ConfigCreateForm({ onClose }: ConfigCreateFormProps) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const createMutation = useCreateAdminConfig();

  const RESTART_KEYS = new Set(['MARKET_PROVIDER', 'SIMULATION_STRATEGY', 'CURRENCY_PROVIDER']);
  const isRestartKey = RESTART_KEYS.has(key);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({
      key,
      value: /^-?\d+(\.\d+)?$/.test(value) ? Number(value) : value,
      name: name || undefined,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div className={`rounded-[var(--main-page-radius-lg)] shadow-[var(--main-page-shadow)] border border-[var(--main-page-border)] w-full max-w-lg [background:var(--main-page-surface-strong)] p-6`} onClick={(e) => e.stopPropagation()}>
        <h3 className="m-0 mb-4 text-text">{admin.config.create}</h3>

        {isRestartKey ? (
          <p className="mb-4 rounded-[var(--main-page-radius-md)] border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600">
            ⚠ {admin.config.restartWarning}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className={fieldGroup}>
            <span className={fieldLabel}>{admin.config.fields.key}</span>
            <input
              className={inputBase}
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              placeholder="NEW_CONFIG_KEY"
              required
            />
          </label>

          <label className={fieldGroup}>
            <span className={fieldLabel}>{admin.config.fields.value}</span>
            <input
              className={inputBase}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </label>

          <label className={fieldGroup}>
            <span className={fieldLabel}>{admin.config.fields.name}</span>
            <input
              className={inputBase}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className={fieldGroup}>
            <span className={fieldLabel}>{admin.config.fields.tags}</span>
            <input
              className={inputBase}
              type="text"
              placeholder="trading, fees"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </label>

          <div className="flex justify-end gap-3">
            <button type="button" className={`${button.base} ${button.secondary}`} onClick={onClose}>
              {admin.actions.cancel}
            </button>
            <button type="submit" className={`${button.base} ${button.primary}`} disabled={createMutation.isPending}>
              {createMutation.isPending ? admin.actions.creating : admin.actions.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
