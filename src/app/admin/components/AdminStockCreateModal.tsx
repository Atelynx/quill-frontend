import { useState, useEffect } from 'react';
import { admin } from '../../../shared/content/strings';
import { button } from '../../../shared/design-system/surfaces';
import { fieldLabel, hint } from '../../../shared/design-system/typography';
import { fieldGroup } from '../../../shared/design-system/layout';
import { inputBase } from '../../../shared/design-system/forms';
import { useCreateAdminStock } from '../../../shared/api/hooks';

interface AdminStockCreateModalProps {
  onClose: () => void;
}

export function AdminStockCreateModal({ onClose }: AdminStockCreateModalProps) {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState<'CLP' | 'USD'>('CLP');
  const [close, setClose] = useState('');
  const [baseVolatility, setBaseVolatility] = useState('0.015');
  const [baseDrift, setBaseDrift] = useState('0');
  const createMutation = useCreateAdminStock();

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
      symbol: symbol.toUpperCase(),
      name,
      currency,
      close: Number(close),
      baseVolatility: baseVolatility ? Number(baseVolatility) : undefined,
      baseDrift: baseDrift ? Number(baseDrift) : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-[var(--main-page-radius-lg)] border border-[var(--main-page-border)] bg-[var(--main-page-surface-strong)] p-6 shadow-[var(--main-page-shadow)]" onClick={(e) => e.stopPropagation()}>
        <h3 className="m-0 mb-4 text-text">{admin.stocks.createTitle}</h3>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className={fieldGroup}>
            <span className={fieldLabel}>{admin.stocks.fields.symbol}</span>
            <input
              className={inputBase}
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="MYSTOCK"
              required
            />
          </label>

          <label className={fieldGroup}>
            <span className={fieldLabel}>{admin.stocks.fields.name}</span>
            <input
              className={inputBase}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Stock"
              required
            />
          </label>

          <label className={fieldGroup}>
            <span className={fieldLabel}>{admin.stocks.fields.currency}</span>
            <select
              className={inputBase}
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'CLP' | 'USD')}
            >
              <option value="CLP">CLP</option>
              <option value="USD">USD</option>
            </select>
          </label>

          <label className={fieldGroup}>
            <span className={fieldLabel}>{admin.stocks.fields.price}</span>
            <input
              className={inputBase}
              type="number"
              step="any"
              value={close}
              onChange={(e) => setClose(e.target.value)}
              placeholder="1500"
              required
            />
          </label>

          <label className={fieldGroup}>
            <span className={fieldLabel}>Base Volatility</span>
            <input
              className={inputBase}
              type="number"
              step="any"
              value={baseVolatility}
              onChange={(e) => setBaseVolatility(e.target.value)}
            />
            <span className={hint}>Para la simulación de ticks (por defecto: 0.015)</span>
          </label>

          <label className={fieldGroup}>
            <span className={fieldLabel}>Base Drift</span>
            <input
              className={inputBase}
              type="number"
              step="any"
              value={baseDrift}
              onChange={(e) => setBaseDrift(e.target.value)}
            />
            <span className={hint}>Para la simulación de ticks (por defecto: 0)</span>
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
