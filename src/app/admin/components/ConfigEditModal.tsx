import { useState, useEffect } from 'react';
import { admin } from '../../../shared/content/strings';
import { button } from '../../../shared/design-system/surfaces';
import { fieldLabel, hint } from '../../../shared/design-system/typography';
import { fieldGroup } from '../../../shared/design-system/layout';
import { inputBase, successMessage, errorMessage } from '../../../shared/design-system/forms';
import { useUpdateAdminConfig } from '../../../shared/api/hooks';
import { getApiErrorMessage } from '../../../shared/api/get-api-error-message';
import type { AdminConfig } from '../../../shared/api/validators';

interface ConfigEditModalProps {
  config: AdminConfig;
  onClose: () => void;
}

export function ConfigEditModal({ config, onClose }: ConfigEditModalProps) {
  const [value, setValue] = useState(String(config.value));
  const [name, setName] = useState(config.name ?? '');
  const [tags, setTags] = useState(config.tags?.join(', ') ?? '');
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const updateMutation = useUpdateAdminConfig();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const parseValue = (raw: string): string | number | boolean => {
    if (config.value !== undefined && typeof config.value === 'boolean') {
      return raw === 'true';
    }
    const num = Number(raw);
    return isNaN(num) ? raw : num;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      await updateMutation.mutateAsync({
        key: config.key,
        data: {
          value: parseValue(value),
          name: name || undefined,
          tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        },
      });
      setMessage({ text: 'Configuración guardada correctamente.', isError: false });
      setTimeout(onClose, 1200);
    } catch (error) {
      setMessage({ text: getApiErrorMessage(error, 'Error al guardar la configuración.'), isError: true });
    }
  };

  const isBoolean = typeof config.value === 'boolean';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className={`rounded-[var(--main-page-radius-lg)] shadow-[var(--main-page-shadow)] border border-[var(--main-page-border)] w-full max-w-lg [background:var(--main-page-surface-strong)] p-6`} onClick={(e) => e.stopPropagation()}>
        <h3 className="m-0 mb-4 text-text">{admin.config.edit} — {config.key}</h3>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className={fieldGroup}>
            <span className={fieldLabel}>{admin.config.fields.value}</span>
            {isBoolean ? (
              <select
                className={inputBase}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            ) : (
              <input
                className={inputBase}
                type={typeof config.value === 'number' ? 'number' : 'text'}
                step={typeof config.value === 'number' ? 'any' : undefined}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            )}
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
              placeholder="trading, fees, promo"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <span className={hint}>Separadas por coma</span>
          </label>

          {message ? (
            <p className={message.isError ? errorMessage : successMessage}>{message.text}</p>
          ) : null}

          <div className="flex justify-end gap-3">
            <button type="button" className={`${button.base} ${button.secondary}`} onClick={onClose}>
              {admin.actions.cancel}
            </button>
            <button type="submit" className={`${button.base} ${button.primary}`} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? admin.actions.saving : admin.actions.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
