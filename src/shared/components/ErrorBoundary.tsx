import { Component, ReactNode } from 'react';

/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global Error Boundary Component
 *
 * Catches component rendering errors and displays a graceful error UI
 * instead of crashing the entire application.
 *
 * Usage:
 * <ErrorBoundary fallback={<ErrorPage />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Update state so the next render will show the fallback UI
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * Log error details for debugging
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Component render error:', {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  render() {
    if (this.state.hasError) {
      // If custom fallback provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div
          style={{
            padding: '2rem',
            margin: '1rem',
            border: '1px solid #e53e3e',
            borderRadius: '0.5rem',
            backgroundColor: '#fff5f5',
            color: '#c53030',
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
            Oops! Algo salió mal
          </h2>
          <p style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
            Disculpa, encontramos un error inesperado en la aplicación.
          </p>
          {this.state.error && (
            <details
              style={{
                fontSize: '0.75rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                padding: '0.5rem',
                backgroundColor: '#fed7d7',
                borderRadius: '0.25rem',
                marginTop: '0.5rem',
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Detalles del error (para desarrolladores)
              </summary>
              <code style={{ display: 'block', marginTop: '0.5rem' }}>
                {this.state.error.toString()}
              </code>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#c53030',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
