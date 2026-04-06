import { useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';

interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  hint?: string;
}

export function PasswordField({
  label,
  error,
  hint,
  id,
  ...inputProps
}: PasswordFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="field-group" htmlFor={fieldId}>
      <span className="field-group__label">{label}</span>
      <div className="password-field">
        <input
          {...inputProps}
          id={fieldId}
          type={isVisible ? 'text' : 'password'}
        />
        <button
          aria-label={isVisible ? 'Ocultar contrasena' : 'Mostrar contrasena'}
          className="password-toggle"
          onClick={() => setIsVisible((currentValue) => !currentValue)}
          type="button"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {isVisible ? (
              <path d="M3.7 4.9a1 1 0 0 1 1.4 0l14 14a1 1 0 0 1-1.4 1.4l-2.6-2.6A11.9 11.9 0 0 1 12 18.5c-5.2 0-9.3-4.3-10.5-5.8a1.1 1.1 0 0 1 0-1.4c.8-.9 2.6-2.9 5-4.3L3.7 6.3a1 1 0 0 1 0-1.4Zm6 6 4.3 4.3a3.5 3.5 0 0 1-4.3-4.3Zm2.3-5.4c5.2 0 9.3 4.3 10.5 5.8.3.4.3 1 0 1.4a17 17 0 0 1-3.5 3.2L16.8 14a5.5 5.5 0 0 0-6.8-6.8L8 5.5c1.2-.4 2.6-.7 4-.7Z" />
            ) : (
              <path d="M12 5.5c5.2 0 9.3 4.3 10.5 5.8.3.4.3 1 0 1.4-1.2 1.5-5.3 5.8-10.5 5.8S2.7 14.2 1.5 12.7a1.1 1.1 0 0 1 0-1.4C2.7 9.8 6.8 5.5 12 5.5Zm0 2c-3.5 0-6.5 2.7-8.3 4.5 1.8 1.8 4.8 4.5 8.3 4.5s6.5-2.7 8.3-4.5c-1.8-1.8-4.8-4.5-8.3-4.5Zm0 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
            )}
          </svg>
        </button>
      </div>
      {hint ? <small className="field-group__hint">{hint}</small> : null}
      {error ? <span className="field-group__error">{error}</span> : null}
    </label>
  );
}
