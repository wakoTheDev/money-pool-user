import React, { useCallback, useMemo } from "react";

// Optimized button component with React.memo
const ActionButton = React.memo<{
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  'aria-label'?: string;
}>(({ children, onClick, variant = 'primary', 'aria-label': ariaLabel }) => (
  <button 
    className="mt-6 px-8 py-3 bg-[#2E7D32] text-white rounded-lg w-full hover:bg-[#1B5E20] transition duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#2E7D32] focus:ring-opacity-50 active:scale-95"
    onClick={onClick}
    aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
    type="button"
  >
    <span className="font-medium">{children}</span>
  </button>
));

ActionButton.displayName = 'ActionButton';

// Main component optimized with React.memo
const LandingPage = React.memo(() => {
  // Optimized event handlers with useCallback
  const handleGetStarted = useCallback(() => {
    console.log("Get Started clicked");
    // TODO: Navigate to registration/onboarding
    // - Show registration form
    // - Redirect to dashboard setup
  }, []);

  const handleSignIn = useCallback(() => {
    console.log("Sign In clicked");
    // TODO: Navigate to sign in
    // - Show login form
    // - Handle authentication
  }, []);

  // Memoized content sections to prevent unnecessary re-renders
  const heroContent = useMemo(() => (
    <div className="text-center">
      <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold p-4 text-gray-800 leading-tight">
        Transform Your Chama Management
      </h1>
      <div className="mt-4 text-gray-600 text-center w-full max-w-4xl mx-auto text-lg sm:text-xl lg:text-2xl p-4">
        <p className="leading-relaxed">
          Complete digital platform for Kenyan savings groups. Manage members, track contributions, 
          process loans, and ensure transparency - all in one secure solution.
        </p>
      </div>
    </div>
  ), []);

  const actionButtons = useMemo(() => (
    <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-md mt-8 gap-4 sm:gap-6">
      <ActionButton 
        onClick={handleGetStarted}
        aria-label="Get started with MoneyPool chama management"
      >
        Get Started
      </ActionButton>
      <ActionButton 
        onClick={handleSignIn}
        aria-label="Sign in to your MoneyPool account"
      >
        Sign In
      </ActionButton>
    </div>
  ), [handleGetStarted, handleSignIn]);

  return (
    <div className="flex flex-col items-center justify-center w-full mt-6 p-6 bg-white shadow-md rounded-lg">
      {heroContent}
      {actionButtons}
    </div>
  );
});

LandingPage.displayName = 'LandingPage';

export default LandingPage;
       