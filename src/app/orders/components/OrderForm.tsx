import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useCreateOrderMutation } from '../../../shared/api/hooks';
import { getApiErrorMessage } from '../../../shared/api/get-api-error-message';
import { isStubMode } from '../../../shared/api/stub-mode';
import { CreateOrderInputSchema } from '../../../shared/api/validators';
import type { StockQuote } from '../../../shared/api/validators';
import { formatBothCurrencies, formatCurrency } from '../../../shared/utils/format';
import { labels, orderForm } from '../../../shared/content/strings';
import { button } from '../../../shared/design-system/surfaces';
import { hint as hintClass } from '../../../shared/design-system/typography';
import { formGrid, buyModeToggle, buyModeButton } from '../../../shared/design-system/layout';
import { inputBase, successMessage, errorMessage } from '../../../shared/design-system/forms';

type FormValues = {
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET';
  quantity: number;
  limitPrice?: number;
};

interface OrderFormProps {
  quotes: StockQuote[];
  rate: number;
  selectedSymbol: string;
}

export function OrderForm({ quotes, rate, selectedSymbol }: OrderFormProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [buyMode, setBuyMode] = useState<'shares' | 'amount'>('shares');
  const [investAmount, setInvestAmount] = useState<string>('');
  const limitPriceUserTouched = useRef(false);
  const orderMutation = useCreateOrderMutation();
  const demoMode = isStubMode();

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateOrderInputSchema),
    defaultValues: {
      symbol: selectedSymbol,
      side: 'BUY',
      type: 'LIMIT',
      quantity: 1,
      limitPrice:
          quotes.find((quote) => quote.symbol === selectedSymbol)?.close ?? undefined,
    },
  });

  useEffect(() => {
    form.setValue('symbol', selectedSymbol);
    const quote = quotes.find((q) => q.symbol === selectedSymbol);
    if (quote) {
      form.setValue('limitPrice', quote.close);
    }
    limitPriceUserTouched.current = false;
  }, [selectedSymbol]);

  useEffect(() => {
    if (!limitPriceUserTouched.current) {
      const quote = quotes.find((q) => q.symbol === selectedSymbol);
      if (quote) {
        form.setValue('limitPrice', quote.close);
      }
    }
  }, [quotes]);

  const { onChange: limitPriceOnChange, ...limitPriceRest } = form.register('limitPrice', { valueAsNumber: true });
  const currentQuote = quotes.find((quote) => quote.symbol === selectedSymbol);
  const selectedSide = useWatch({
    control: form.control,
    name: 'side',
  });
  const orderType = useWatch({
    control: form.control,
    name: 'type',
  });
  const watchedLimitPrice = useWatch({
    control: form.control,
    name: 'limitPrice',
  });
  const watchedQuantity = useWatch({
    control: form.control,
    name: 'quantity',
  });

  const handleSubmit = async (values: FormValues) => {
    setFeedbackMessage(null);

    if (demoMode) {
      setFeedbackMessage(orderForm.demoDisabled);
      return;
    }

    try {
      let submitValues = { ...values };

      if (buyMode === 'amount') {
        const price =
          orderType === 'MARKET'
            ? (currentQuote?.close ?? 0)
            : (values.limitPrice ?? 0);

        if (price <= 0) {
          setFeedbackMessage(orderForm.invalidPrice);
          return;
        }

        const calculatedQty = Math.floor(Number(investAmount) / price);
        if (calculatedQty < 1) {
          setFeedbackMessage(orderForm.insufficientQuantity);
          return;
        }

        submitValues.quantity = calculatedQty;
      }

      await orderMutation.mutateAsync(submitValues);
      setFeedbackMessage(
        values.type === 'MARKET'
          ? orderForm.orderExecuted
          : orderForm.orderRegistered,
      );
      form.reset({
        symbol: selectedSymbol,
        side: 'BUY',
        type: 'LIMIT',
        quantity: 1,
        limitPrice:
          quotes.find((quote) => quote.symbol === selectedSymbol)?.close ?? undefined,
      });
      setInvestAmount('');
    } catch (error) {
      console.error('[OrderForm] Error submitting order:', error);
    }
  };

  const handleModeToggle = (mode: 'shares' | 'amount') => {
    setBuyMode(mode);
    form.setValue('quantity', 1);
    if (mode === 'amount') {
      setInvestAmount('');
    }
  };

  const investAmountValue = investAmount === '' ? 0 : Number(investAmount);

  const sharesCostPreview = (() => {
    if (buyMode !== 'shares' || !watchedQuantity || watchedQuantity < 1) return null;

    const price =
      orderType === 'MARKET'
        ? (currentQuote?.close ?? 0)
        : (watchedLimitPrice ?? 0);

    if (price <= 0) return null;

    const totalCost = watchedQuantity * price;
    return (
      <p className={hintClass}>
        Costo total estimado: {formatBothCurrencies(totalCost, rate)}
        <br />
        <small>
          ({watchedQuantity} acciones &times; {formatCurrency(price, { currency: 'CLP' })} c/u)
        </small>
      </p>
    );
  })();

  const calculatedPreview = (() => {
    if (buyMode !== 'amount' || investAmountValue <= 0) return null;

    const price =
      orderType === 'MARKET'
        ? (currentQuote?.close ?? 0)
        : (watchedLimitPrice ?? 0);

    if (price <= 0) return null;

    const calculatedQty = Math.floor(investAmountValue / price);

    if (calculatedQty < 1) {
      return (
        <p className={hintClass} style={{ color: 'var(--main-page-danger)' }}>
          Monto insuficiente. Debe ser al menos{' '}
          {formatCurrency(price, { currency: 'CLP' })} para comprar 1 accion.
        </p>
      );
    }

    const totalCost = calculatedQty * price;
    return (
      <p className={hintClass}>
        &asymp; {calculatedQty} acciones &middot; Costo estimado:{' '}
        {formatBothCurrencies(totalCost, rate)}
        <br />
        <small>
          ({formatCurrency(totalCost, { currency: 'CLP' })} / {calculatedQty}{' '}
          acciones &times; {formatCurrency(price, { currency: 'CLP' })} c/u)
        </small>
      </p>
    );
  })();

  return (
    <form
      className={formGrid}
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      {demoMode ? (
        <p className={hintClass}>{orderForm.demoHint}</p>
      ) : null}

      <div>
        <strong>{orderForm.currentPrice}</strong>
        <span className={hintClass}>
          {currentQuote
            ? `${currentQuote.symbol} · ${formatBothCurrencies(currentQuote.close, rate)}`
            : orderForm.selectStock}
        </span>
      </div>

      <label>
        {labels.field.symbol}
        <select className={inputBase} disabled={demoMode} {...form.register('symbol')}>
          {quotes.map((quote) => (
            <option key={quote.symbol} value={quote.symbol}>
              {quote.symbol} · {quote.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        {labels.table.side}
        <select className={inputBase} disabled={demoMode} {...form.register('side')}>
          <option value="BUY">{labels.action.buy}</option>
          <option value="SELL">{labels.action.sell}</option>
        </select>
      </label>

      <label>
        {labels.table.type}
        <select className={inputBase} disabled={demoMode} {...form.register('type')}>
          <option value="LIMIT">{labels.action.limit}</option>
          <option value="MARKET">{labels.action.market}</option>
        </select>
      </label>

      <div className={buyModeToggle}>
        <button
          type="button"
          className={`${button.base} ${buyModeButton} ${buyMode === 'shares' ? button.primary : button.secondary}`}
          disabled={demoMode}
          onClick={() => handleModeToggle('shares')}
        >
          {labels.action.byShares}
        </button>
        <button
          type="button"
          className={`${button.base} ${buyModeButton} ${buyMode === 'amount' ? button.primary : button.secondary}`}
          disabled={demoMode}
          onClick={() => handleModeToggle('amount')}
        >
          {labels.action.byAmount}
        </button>
      </div>

      {buyMode === 'shares' ? (
        <label>
          {labels.field.quantity}
          <input
            className={inputBase}
            disabled={demoMode}
            type="number"
            {...form.register('quantity', { valueAsNumber: true })}
          />
        </label>
      ) : (
        <label>
          {labels.field.investAmount}
          <input
            className={inputBase}
            disabled={demoMode}
            type="number"
            value={investAmount}
            onChange={(e) => setInvestAmount(e.target.value)}
          />
        </label>
      )}

      {sharesCostPreview}

      {orderType === 'LIMIT' ? (
        <label>
          {orderForm.limitPriceLabel}
          <input
            className={inputBase}
            disabled={demoMode}
            step="0.01"
            type="number"
            onChange={(e) => {
              limitPriceUserTouched.current = true;
              limitPriceOnChange(e);
            }}
            {...limitPriceRest}
          />
          {watchedLimitPrice && watchedLimitPrice > 0 ? (
            <small className={hintClass}>
              ≈ {formatCurrency(watchedLimitPrice, { currency: 'USD', rate })}
            </small>
          ) : null}
        </label>
      ) : null}

      {calculatedPreview}

      <p className={hintClass}>
        {orderType === 'MARKET'
          ? orderForm.description.market
          : selectedSide === 'BUY'
            ? orderForm.description.buy
            : orderForm.description.sell}
      </p>

      {feedbackMessage ? <p className={successMessage}>{feedbackMessage}</p> : null}
      {orderMutation.isError ? (
        <p className={errorMessage}>
          {getApiErrorMessage(
            orderMutation.error,
            orderForm.errorFallback,
          )}
        </p>
      ) : null}

      <button
        className={`${button.base} ${button.primary}`}
        disabled={orderMutation.isPending || demoMode}
        type="submit"
      >
        {demoMode ? labels.action.demoMode : orderMutation.isPending ? labels.action.creatingOrder : labels.action.createOrder}
      </button>
    </form>
  );
}
