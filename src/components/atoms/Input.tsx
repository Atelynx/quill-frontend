// components/atoms/Input/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => (
    <>
      <input
        ref={ref}
        className={`
          w-full px-3 py-2 rounded-md border border-border
          bg-background text-text
          focus:outline-none focus:ring-2 focus:ring-primary
          transition-colors
          ${error ? 'border-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </>
  )
);