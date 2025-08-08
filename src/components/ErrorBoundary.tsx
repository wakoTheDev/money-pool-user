"use client";

import React, { Component, ReactNode } from 'react';

// Define ErrorInfo interface since it's not exported in React 19
interface ErrorInfo {
  componentStack: string;
}

interface Props {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// Optimized error boundary with better error handling and reporting
class ErrorBoundary extends Component<Props, State> {
  private errorResetTimeoutId: NodeJS.Timeout | null = null;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Log error for monitoring (replace with your error reporting service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Report to external service (uncomment and configure as needed)
    // if (process.env.NODE_ENV === 'production') {
    //   this.reportError(error, errorInfo);
    // }

    // Auto-reset after 5 seconds in development
    if (process.env.NODE_ENV === 'development') {
      this.errorResetTimeoutId = setTimeout(() => {
        this.resetError();
      }, 5000);
    }
  }

  public componentWillUnmount() {
    if (this.errorResetTimeoutId) {
      clearTimeout(this.errorResetTimeoutId);
    }
  }

  // Method to reset error state
  private resetError = () => {
    if (this.errorResetTimeoutId) {
      clearTimeout(this.errorResetTimeoutId);
      this.errorResetTimeoutId = null;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  // Method to report errors to external service
  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // TODO: Implement error reporting to your preferred service
    // Examples: Sentry, Bugsnag, LogRocket, etc.
    /*
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
    */
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      // Default error UI
      return (
        <div className="flex items-center justify-center min-h-[400px] bg-red-50 rounded-lg border border-red-200 m-4">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="text-red-500 mb-4">
              <svg 
                className="w-16 h-16 mx-auto" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Oops! Something went wrong
            </h2>
            
            <p className="text-gray-600 text-sm mb-4">
              We encountered an unexpected error. Our team has been notified and is working on a fix.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.resetError}
                className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2"
                aria-label="Try again"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Reload page"
              >
                Reload Page
              </button>
            </div>

            {/* Development-only error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium">
                  Show Error Details (Development Only)
                </summary>
                <div className="mt-3 p-4 bg-gray-100 rounded-lg text-xs font-mono overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong className="text-red-600">Error:</strong>
                    <pre className="text-red-700 mt-1">{this.state.error.toString()}</pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong className="text-red-600">Component Stack:</strong>
                      <pre className="text-gray-600 mt-1 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Higher-order component for easier usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  customFallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary children={<Component {...props} />} fallback={customFallback} />
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for error boundary functionality in functional components
export const useErrorHandler = () => {
  return React.useCallback((error: Error, errorInfo?: string) => {
    console.error('Handled error:', error, errorInfo);
    
    // Report error to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Report to your error monitoring service
      // Example: Sentry.captureException(error);
    }
    
    // Could also trigger a toast notification or other user feedback
  }, []);
};
