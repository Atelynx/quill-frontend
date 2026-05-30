import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
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
  const [isLimitPriceFocused, setIsLimitPriceFocused] = useState(false);
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
  }, [selectedSymbol]);

  useEffect(() => {
    if (!isLimitPriceFocused) {
      const quote = quotes.find((q) => q.symbol === selectedSymbol);
      if (quote) {
        form.setValue('limitPrice', quote.close);
      }
    }
  }, [quotes, selectedSymbol, isLimitPriceFocused]);

  const handleSubmit = async (values: FormValues) => {
    setFeedbackMessage(null);
    try {
      await orderMutation.mutateAsync(values);
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
    } catch (error) {
      console.error('[OrderForm] Error submitting order:', error);
    }
  };

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

      <label>
        Cantidad
        <input
          type="number"
          {...form.register('quantity', { valueAsNumber: true })}
        />
      </label>

      {orderType === 'LIMIT' ? (
        <label>
          Precio limite (CLP)
          <input
            step="0.01"
            type="number"
            {...form.register('limitPrice', { valueAsNumber: true })}
            onFocus={() => setIsLimitPriceFocused(true)}
            onBlur={() => setIsLimitPriceFocused(false)}
          />
          {watchedLimitPrice && watchedLimitPrice > 0 ? (
            <small className="field-group__hint">
              ≈ {formatCurrency(watchedLimitPrice, { currency: 'USD', rate })}
            </small>
          ) : null}
        </label>
      ) : null}

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
