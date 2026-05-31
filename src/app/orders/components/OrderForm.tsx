import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useCreateOrderMutation } from '../../../shared/api/hooks';
import { getApiErrorMessage } from '../../../shared/api/get-api-error-message';
import { CreateOrderInputSchema } from '../../../shared/api/validators';
import type { StockQuote } from '../../../shared/api/validators';
import { formatBothCurrencies, formatCurrency } from '../../../shared/utils/format';

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
    try {
      let submitValues = { ...values };

      if (buyMode === 'amount') {
        const price =
          orderType === 'MARKET'
            ? (currentQuote?.close ?? 0)
            : (values.limitPrice ?? 0);

        if (price <= 0) {
          setFeedbackMessage('Precio invalido. Verifica los datos.');
          return;
        }

        const calculatedQty = Math.floor(Number(investAmount) / price);
        if (calculatedQty < 1) {
          setFeedbackMessage(
            'El monto ingresado no es suficiente para comprar al menos 1 accion.',
          );
          return;
        }

        submitValues.quantity = calculatedQty;
      }

      await orderMutation.mutateAsync(submitValues);
      setFeedbackMessage(
        values.type === 'MARKET'
          ? 'Orden ejecutada al precio de mercado.'
          : 'Orden registrada. Quedara pendiente hasta que el mercado cumpla la condicion.',
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
      <p className="field-help">
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
        <p className="field-help" style={{ color: 'var(--main-page-danger)' }}>
          Monto insuficiente. Debe ser al menos{' '}
          {formatCurrency(price, { currency: 'CLP' })} para comprar 1 accion.
        </p>
      );
    }

    const totalCost = calculatedQty * price;
    return (
      <p className="field-help">
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
      className="order-form"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className="inline-note">
        <strong>Precio actual</strong>
        <span>
          {currentQuote
            ? `${currentQuote.symbol} · ${formatBothCurrencies(currentQuote.close, rate)}`
            : 'Selecciona una accion para continuar.'}
        </span>
      </div>

      <label>
        Accion
        <select {...form.register('symbol')}>
          {quotes.map((quote) => (
            <option key={quote.symbol} value={quote.symbol}>
              {quote.symbol} · {quote.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Tipo
        <select {...form.register('side')}>
          <option value="BUY">Compra</option>
          <option value="SELL">Venta</option>
        </select>
      </label>

      <label>
        Modalidad
        <select {...form.register('type')}>
          <option value="LIMIT">Limite</option>
          <option value="MARKET">Mercado</option>
        </select>
      </label>

      <div className="buy-mode-toggle">
        <button
          type="button"
          className={buyMode === 'shares' ? 'primary-button' : 'secondary-button'}
          onClick={() => handleModeToggle('shares')}
        >
          Por cantidad
        </button>
        <button
          type="button"
          className={buyMode === 'amount' ? 'primary-button' : 'secondary-button'}
          onClick={() => handleModeToggle('amount')}
        >
          Por monto
        </button>
      </div>

      {buyMode === 'shares' ? (
        <label>
          Cantidad
          <input
            type="number"
            {...form.register('quantity', { valueAsNumber: true })}
          />
        </label>
      ) : (
        <label>
          Monto a invertir (CLP)
          <input
            type="number"
            value={investAmount}
            onChange={(e) => setInvestAmount(e.target.value)}
          />
        </label>
      )}

      {sharesCostPreview}

      {orderType === 'LIMIT' ? (
        <label>
          Precio limite (CLP)
          <input
            step="0.01"
            type="number"
            onChange={(e) => {
              limitPriceUserTouched.current = true;
              limitPriceOnChange(e);
            }}
            {...limitPriceRest}
          />
          {watchedLimitPrice && watchedLimitPrice > 0 ? (
            <small className="field-group__hint">
              ≈ {formatCurrency(watchedLimitPrice, { currency: 'USD', rate })}
            </small>
          ) : null}
        </label>
      ) : null}

      {calculatedPreview}

      <p className="field-help">
        {orderType === 'MARKET'
          ? 'La orden se ejecutara de inmediato al precio actual del mercado.'
          : selectedSide === 'BUY'
            ? 'La compra se ejecuta cuando el mercado cae al precio limite o por debajo.'
            : 'La venta se ejecuta cuando el mercado sube al precio limite o por encima.'}
      </p>

      {feedbackMessage ? <p className="form-success">{feedbackMessage}</p> : null}
      {orderMutation.isError ? (
        <p className="form-error">
          {getApiErrorMessage(
            orderMutation.error,
            'No fue posible registrar la orden.',
          )}
        </p>
      ) : null}

      <button
        className="primary-button"
        disabled={orderMutation.isPending}
        type="submit"
      >
        {orderMutation.isPending ? 'Creando orden...' : 'Crear orden'}
      </button>
    </form>
  );
}
