import { Component } from 'react';
import type { ReactNode } from 'react';
import { errorBoundary } from '../content/strings';

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
        <div className="m-4 rounded-lg border border-red-600 bg-red-50 p-8 text-red-700">
          <h2 className="mb-2 mt-0 text-lg font-bold">
            {errorBoundary.title}
          </h2>
          <p className="mb-4 text-sm">
            {errorBoundary.description}
          </p>
          {this.state.error && (
            <details className="mt-2 whitespace-pre-wrap break-all rounded bg-red-200 p-2 text-xs">
              <summary className="cursor-pointer font-bold">
                {errorBoundary.detailsSummary}
              </summary>
              <code className="mt-2 block">
                {this.state.error.toString()}
              </code>
            </details>
          )}
          <button
            className="mt-4 cursor-pointer rounded border-none bg-red-700 px-4 py-2 text-sm text-white"
            onClick={() => window.location.reload()}
          >
            {errorBoundary.reload}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
