import { useState, useEffect } from 'react';
import { admin } from '../../../shared/content/strings';
import { button } from '../../../shared/design-system/surfaces';
import { fieldLabel } from '../../../shared/design-system/typography';
import { fieldGroup } from '../../../shared/design-system/layout';
import { inputBase, successMessage, errorMessage } from '../../../shared/design-system/forms';
import { useCreateAdminConfig } from '../../../shared/api/hooks';
import { getApiErrorMessage } from '../../../shared/api/get-api-error-message';

interface ConfigCreateFormProps {
  onClose: () => void;
}

export function ConfigCreateForm({ onClose }: ConfigCreateFormProps) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const createMutation = useCreateAdminConfig();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      await createMutation.mutateAsync({
        key,
        value: isNaN(Number(value)) ? value : Number(value),
        name: name || undefined,
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      });
      setMessage({ text: 'Configuración creada correctamente.', isError: false });
      setTimeout(onClose, 1200);
    } catch (error) {
      setMessage({ text: getApiErrorMessage(error, 'Error al crear la configuración.'), isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div className={`rounded-[var(--main-page-radius-lg)] shadow-[var(--main-page-shadow)] border border-[var(--main-page-border)] w-full max-w-lg [background:var(--main-page-surface-strong)] p-6`} onClick={(e) => e.stopPropagation()}>
        <h3 className="m-0 mb-4 text-text">{admin.config.create}</h3>

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

          {message ? (
            <p className={message.isError ? errorMessage : successMessage}>{message.text}</p>
          ) : null}

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
