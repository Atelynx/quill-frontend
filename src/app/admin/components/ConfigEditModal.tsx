import { useState, useEffect } from 'react';
import { admin } from '../../../shared/content/strings';
import { button, surface } from '../../../shared/design-system/surfaces';
import { fieldLabel, hint } from '../../../shared/design-system/typography';
import { fieldGroup } from '../../../shared/design-system/layout';
import { errorMessage, inputBase } from '../../../shared/design-system/forms';
import { useUpdateAdminConfig } from '../../../shared/api/hooks';
import { UpdateConfigInputSchema } from '../../../shared/api/validators';
import type { AdminConfig } from '../../../shared/api/validators';

interface ConfigEditModalProps {
  config: AdminConfig;
  onClose: () => void;
}

export function ConfigEditModal({ config, onClose }: ConfigEditModalProps) {
  const [value, setValue] = useState(String(config.value));
  const [name, setName] = useState(config.name ?? '');
  const [tags, setTags] = useState(config.tags?.join(', ') ?? '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const updateMutation = useUpdateAdminConfig();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedValue =
      typeof config.value === 'boolean'
        ? value === 'true'
        : typeof config.value === 'number'
          ? Number(value)
          : value;
    const parsedInput = UpdateConfigInputSchema.safeParse({
      value: parsedValue,
      name: name || undefined,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
    });

    if (!parsedInput.success) {
      setValidationError('El valor ingresado no es válido para esta configuración.');
      return;
    }

    setValidationError(null);
    await updateMutation.mutateAsync({
      key: config.key,
      data: parsedInput.data,
    });
    onClose();
  };

  const isRestartRequired = config.appliesOn === 'restart';

  return (
    <div className={surface.modalOverlay} onClick={onClose}>
      <div className={surface.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className="m-0 mb-4 text-text">{admin.config.edit} — {config.key}</h3>

        {isRestartRequired ? (
          <p className="mb-4 rounded-[var(--main-page-radius-md)] border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600">
            ⚠ {admin.config.restartWarning}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className={fieldGroup}>
            <span className={fieldLabel}>{admin.config.fields.value}</span>
            {typeof config.value === 'boolean' ? (
              <select className={inputBase} value={value} onChange={(e) => setValue(e.target.value)}>
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

          {validationError ? <p className={errorMessage}>{validationError}</p> : null}

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
