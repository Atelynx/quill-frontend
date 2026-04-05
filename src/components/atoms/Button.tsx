// components/atoms/Button/Button.tsx
import React from 'react';
import { useAppSelector } from '@/store/hooks';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const { dyslexicFont } = useAppSelector((state) => state.accessibility);

    const sizeClasses = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const variantClasses = {
      primary: 'bg-primary text-white hover:bg-primary/90',
      secondary: 'bg-secondary text-white hover:bg-secondary/90',
      accent: 'bg-accent text-black hover:bg-accent/90',
      ghost: 'bg-transparent border border-border text-text hover:bg-surface',
    };

    return (
      <button
        ref={ref}
        className={`
          rounded-md font-medium transition-colors
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${dyslexicFont ? 'font-dyslexic' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';