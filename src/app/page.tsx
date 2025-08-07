"use client";

import React, { Suspense, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";

// Optimized lazy loading with better error boundaries and loading states
const LandingPage = dynamic(() => import("@/components/landing-page"), {
  ssr: true,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm">Loading landing page...</p>
      </div>
    </div>
  )
});

const Dashboard = dynamic(() => import("@/components/Dashboard"), {
  ssr: false, // Dashboard contains client-side only features
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading MoneyPool Dashboard...</p>
        <p className="text-gray-500 text-sm mt-1">Please wait while we set up your workspace</p>
      </div>
    </div>
  )
});

// Optimized loading fallback component
const LoadingFallback = React.memo(() => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="text-center max-w-md mx-auto px-6">
      <div className="loading-spinner mx-auto mb-4 w-8 h-8 border-4"></div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading MoneyPool</h2>
      <p className="text-gray-600 text-sm">
        Setting up your chama management platform...
      </p>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

// Error boundary component for better error handling
const ErrorFallback = React.memo<{
  error: Error;
  resetError: () => void;
}>(({ error, resetError }) => (
  <div className="flex items-center justify-center min-h-screen bg-red-50">
    <div className="text-center max-w-md mx-auto px-6">
      <div className="text-red-500 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
      <p className="text-gray-600 text-sm mb-4">
        We encountered an error while loading MoneyPool. Please try again.
      </p>
      <button
        onClick={resetError}
        className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2"
      >
        Try Again
      </button>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Show error details
          </summary>
          <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  </div>
));

ErrorFallback.displayName = 'ErrorFallback';

// Main Home component with optimizations
const Home = React.memo(() => {
  // State management for app mode (could be moved to context/store for larger apps)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [authLoading, setAuthLoading] = React.useState(true);

  // Simulate auth check (replace with actual auth logic)
  React.useEffect(() => {
    const checkAuth = () => {
      try {
        // TODO: Replace with actual authentication check
        // - Check localStorage/sessionStorage for tokens
        // - Validate token with backend
        // - Set authentication state
        
        const hasToken = localStorage.getItem('authToken');
        setIsAuthenticated(!!hasToken);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    const timer = setTimeout(checkAuth, 100); // Small delay for better UX
    return () => clearTimeout(timer);
  }, []);

  // Optimized authentication handler
  const handleAuthSuccess = useCallback(() => {
    setIsAuthenticated(true);
    // TODO: Add success notification
    console.log('Authentication successful');
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    // TODO: Clear other auth-related data
    console.log('User logged out');
  }, []);

  // Memoized main content based on auth state
  const mainContent = useMemo(() => {
    if (authLoading) {
      return <LoadingFallback />;
    }

    // For demo purposes, we're showing the Dashboard by default
    // In production, you would check authentication state
    return (
      <Suspense fallback={<LoadingFallback />}>
        {/* Toggle between components based on authentication */}
        {/* {isAuthenticated ? (
          <Dashboard />
        ) : (
          <LandingPage onAuthSuccess={handleAuthSuccess} />
        )} */}
        
        {/* For now, always show Dashboard - remove this in production */}
        <Dashboard />
      </Suspense>
    );
  }, [authLoading, isAuthenticated, handleAuthSuccess]);

  // Error boundary wrapper
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = useCallback(() => {
    setHasError(false);
    setError(null);
  }, []);

  // Error boundary effect
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(new Error(event.message));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setHasError(true);
      setError(new Error(event.reason));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError && error) {
    return <ErrorFallback error={error} resetError={resetError} />;
  }

  return (
    <div className="font-sans flex flex-col items-center justify-start min-h-screen w-[95%] max-w-7xl mx-auto bg-white">
      <main 
        className="flex flex-col w-full rounded-lg p-2 bg-white border border-blue-200 shadow-sm"
        role="main"
        aria-label="MoneyPool application"
      >
        {mainContent}
      </main>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
