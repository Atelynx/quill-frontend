import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useCreateOrderMutation } from '../../../shared/api/hooks';
import { getApiErrorMessage } from '../../../shared/api/get-api-error-message';
import { CreateOrderInputSchema } from '../../../shared/api/validators';
import type { StockQuote } from '../../../shared/api/validators';

type FormValues = {
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  limitPrice: number;
};

interface OrderFormProps {
  quotes: StockQuote[];
  selectedSymbol: string;
}

export function OrderForm({ quotes, selectedSymbol }: OrderFormProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const orderMutation = useCreateOrderMutation();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(CreateOrderInputSchema),
    defaultValues: {
      symbol: selectedSymbol,
      side: 'BUY',
      quantity: 1,
      limitPrice:
          quotes.find((quote) => quote.symbol === selectedSymbol)?.close ?? 0,
    },
  });

  useEffect(() => {
    form.setValue('symbol', selectedSymbol);
    form.setValue(
      'limitPrice',
      quotes.find((quote) => quote.symbol === selectedSymbol)?.close ?? 0,
    );
  }, [form, quotes, selectedSymbol]);

  const handleSubmit = async (values: FormValues) => {
    setFeedbackMessage(null);
    try {
      await orderMutation.mutateAsync(values);
      setFeedbackMessage(
        'Orden registrada. Quedara pendiente hasta que el mercado cumpla la condicion.',
      );
      form.reset({
        symbol: selectedSymbol,
        side: 'BUY',
        quantity: 1,
        limitPrice:
          quotes.find((quote) => quote.symbol === selectedSymbol)?.close ?? 0,
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

  return (
    <form
      className="order-form"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className="inline-note">
        <strong>Precio actual</strong>
        <span>
          {currentQuote
            ? `${currentQuote.symbol} · ${currentQuote.close.toFixed(2)} USD`
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
          <option value="BUY">Compra limitada</option>
          <option value="SELL">Venta limitada</option>
        </select>
      </label>

      <label>
        Cantidad
        <input
          type="number"
          {...form.register('quantity', { valueAsNumber: true })}
        />
      </label>

      <label>
        Precio limite
        <input
          step="0.01"
          type="number"
          {...form.register('limitPrice', { valueAsNumber: true })}
        />
      </label>

      <p className="field-help">
        {selectedSide === 'BUY'
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
