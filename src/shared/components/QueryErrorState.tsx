import { errorMessage } from '../design-system/forms';
import { Button } from './Button';

interface QueryErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function QueryErrorState({ message, onRetry }: QueryErrorStateProps) {
  return (
    <div className={`${errorMessage} grid gap-3`}>
      <p className="m-0">{message}</p>
      <div>
        <Button type="button" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    </div>
  );
}
