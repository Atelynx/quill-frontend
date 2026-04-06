import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { getApiErrorMessage } from '../../../shared/api/get-api-error-message';
import { apiClient } from '../../../shared/api/http';
import type { StockQuote } from '../../../shared/api/types';

const schema = z.object({
  symbol: z.string().min(1),
  side: z.enum(['BUY', 'SELL']),
  quantity: z.number().int().positive(),
  limitPrice: z.number().positive(),
});

type FormValues = z.infer<typeof schema>;

interface OrderFormProps {
  quotes: StockQuote[];
  selectedSymbol: string;
}

export function OrderForm({ quotes, selectedSymbol }: OrderFormProps) {
  const queryClient = useQueryClient();
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      symbol: selectedSymbol,
      side: 'BUY',
      quantity: 1,
      limitPrice:
        quotes.find((quote) => quote.symbol === selectedSymbol)?.currentPrice ?? 0,
    },
  });

  useEffect(() => {
    form.setValue('symbol', selectedSymbol);
    form.setValue(
      'limitPrice',
      quotes.find((quote) => quote.symbol === selectedSymbol)?.currentPrice ?? 0,
    );
  }, [form, quotes, selectedSymbol]);

  const orderMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      setFeedbackMessage(null);
      await apiClient.post('/orders', values);
    },
    onSuccess: () => {
      setFeedbackMessage(
        'Orden registrada. Quedara pendiente hasta que el mercado cumpla la condicion.',
      );
      void queryClient.invalidateQueries({ queryKey: ['portfolio-summary'] });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: ['trades'] });
      form.reset({
        symbol: selectedSymbol,
        side: 'BUY',
        quantity: 1,
        limitPrice:
          quotes.find((quote) => quote.symbol === selectedSymbol)?.currentPrice ?? 0,
      });
    },
  });

  const currentQuote = quotes.find((quote) => quote.symbol === selectedSymbol);
  const selectedSide = useWatch({
    control: form.control,
    name: 'side',
  });

  return (
    <form
      className="order-form"
      onSubmit={form.handleSubmit((values) => orderMutation.mutate(values))}
    >
      <div className="inline-note">
        <strong>Precio actual</strong>
        <span>
          {currentQuote
            ? `${currentQuote.symbol} · ${currentQuote.currentPrice.toFixed(2)} USD`
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
