import { useState, useEffect } from 'react';
import { admin } from '../../../shared/content/strings';
import { button } from '../../../shared/design-system/surfaces';
import { fieldLabel } from '../../../shared/design-system/typography';
import { fieldGroup } from '../../../shared/design-system/layout';
import { inputBase } from '../../../shared/design-system/forms';
import { useUpdateAdminStockPrice } from '../../../shared/api/hooks';
import type { AdminStock } from '../../../shared/api/validators';

interface AdminStockPriceModalProps {
  stock: AdminStock;
  onClose: () => void;
}

export function AdminStockPriceModal({ stock, onClose }: AdminStockPriceModalProps) {
  const [price, setPrice] = useState(String(stock.close));
  const updateMutation = useUpdateAdminStockPrice();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMutation.mutateAsync({
      symbol: stock.symbol,
      data: { price: Number(price) },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-[var(--main-page-radius-lg)] border border-[var(--main-page-border)] bg-[var(--main-page-surface-strong)] p-6 shadow-[var(--main-page-shadow)]" onClick={(e) => e.stopPropagation()}>
        <h3 className="m-0 mb-1 text-text">{admin.stocks.updatePriceTitle}</h3>
        <p className="mb-4 text-[0.85rem] text-[var(--main-page-text-soft)]">{stock.symbol} — {stock.name}</p>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className={fieldGroup}>
            <span className={fieldLabel}>{admin.stocks.fields.price}</span>
            <input
              className={inputBase}
              type="number"
              step="any"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>

          <p className="m-0 rounded-[var(--main-page-radius-md)] border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600">
            ⚠ {admin.stocks.updatePriceWarning}
          </p>

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
