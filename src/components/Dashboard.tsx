"use client";

import React, { useState, useCallback, useMemo, lazy, Suspense, useEffect } from "react";
import SideBar from "@/components/bar/side-bar";
import TitleCard from "./bar/title-card";
import ErrorBoundary from "./ErrorBoundary";
import { FaBars, FaTimes } from "react-icons/fa";

// Optimized lazy loading with better chunking
const Members = lazy(() => 
  import("./bar/Members").then(module => ({ default: module.default }))
);

const Contributions = lazy(() => 
  import("./bar/Contributions").then(module => ({ default: module.default }))
);

const Loans = lazy(() => 
  import("./bar/Loans").then(module => ({ default: module.default }))
);

const Meetings = lazy(() => 
  import("./bar/Meetings").then(module => ({ default: module.default }))
);

const Report = lazy(() => 
  import("./bar/Report").then(module => ({ default: module.default }))
);

const DashboardOverview = lazy(() => 
  import("./bar/Dashboard").then(module => ({ default: module.default }))
);

// Optimized loading component with better UX
const ComponentLoader = React.memo<{ 
  componentName?: string; 
  size?: 'small' | 'medium' | 'large';
}>(({ componentName, size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-32',
    medium: 'h-64',
    large: 'h-96'
  };

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]} bg-gray-50 rounded-lg`}>
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-3 w-8 h-8 border-4"></div>
        <p className="text-gray-600 text-sm font-medium">
          {componentName ? `Loading ${componentName}...` : 'Loading...'}
        </p>
        <p className="text-gray-500 text-xs mt-1">Please wait</p>
      </div>
    </div>
  );
});

ComponentLoader.displayName = 'ComponentLoader';

// Component registry with performance optimization
const componentRegistry = {
  "Dashboard": {
    component: DashboardOverview,
    displayName: "Dashboard Overview"
  },
  "Members": {
    component: Members,
    displayName: "Members Management"
  },
  "Contributions": {
    component: Contributions,
    displayName: "Contributions Tracking"
  },
  "Loans": {
    component: Loans,
    displayName: "Loans Management"
  },
  "Meetings": {
    component: Meetings,
    displayName: "Meetings Schedule"
  },
  "Report": {
    component: Report,
    displayName: "Reports & Analytics"
  },
} as const;

type ComponentKey = keyof typeof componentRegistry;

// Custom hook for keyboard navigation
const useKeyboardNavigation = (
  activeComponent: string,
  onNavigate: (component: ComponentKey) => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + Number keys for quick navigation
      if (event.ctrlKey && event.key >= '1' && event.key <= '6') {
        event.preventDefault();
        const components = Object.keys(componentRegistry) as ComponentKey[];
        const index = parseInt(event.key) - 1;
        if (components[index]) {
          onNavigate(components[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);
};

// Main Dashboard component
const Dashboard = React.memo(() => {
  // State management with proper typing
  const [activeComponent, setActiveComponent] = useState<ComponentKey>("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);

  // Custom hook for keyboard navigation
  useKeyboardNavigation(activeComponent, (component: ComponentKey) => {
    handleNavigate(component);
  });

  // Optimized handlers with useCallback and proper typing
  const handleNavigate = useCallback((component: ComponentKey | string) => {
    const validComponent = component as ComponentKey;
    if (validComponent === activeComponent) return; // Prevent unnecessary re-renders
    
    setIsLoading(true);
    setActiveComponent(validComponent);
    setSidebarCollapsed(true); // Auto-collapse sidebar on mobile after navigation
    
    // Simulate loading delay for better UX (remove in production)
    setTimeout(() => setIsLoading(false), 100);
  }, [activeComponent]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarCollapsed]);

  // Optimized component rendering with error boundaries
  const CurrentComponent = useMemo(() => {
    const registry = componentRegistry[activeComponent];
    const Component = registry?.component || DashboardOverview;
    const displayName = registry?.displayName || "Dashboard";

    return (
      <ErrorBoundary
        onError={(error, errorInfo) => {
          console.error(`Error in ${displayName}:`, error, errorInfo);
          // TODO: Report to error monitoring service
        }}
      >
        <Suspense 
          fallback={<ComponentLoader componentName={displayName} size="large" />}
        >
          <Component />
        </Suspense>
      </ErrorBoundary>
    );
  }, [activeComponent]);

  // Memoized sidebar toggle button with accessibility
  const SidebarToggle = useMemo(() => (
    <button
      onClick={toggleSidebar}
      className="absolute top-2 left-2 z-50 p-3 bg-gray-800 bg-opacity-20 text-white rounded-lg shadow-lg hover:bg-gray-600 hover:bg-opacity-30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
      aria-label={sidebarCollapsed ? "Open navigation menu" : "Close navigation menu"}
      aria-expanded={!sidebarCollapsed}
      aria-controls="sidebar-navigation"
      type="button"
    >
      {sidebarCollapsed ? (
        <FaBars className="w-5 h-5" aria-hidden="true" />
      ) : (
        <FaTimes className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  ), [sidebarCollapsed, toggleSidebar]);

  // Keyboard shortcuts helper text
  const keyboardShortcuts = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded-lg z-50 hidden lg:block">
          <div>Keyboard shortcuts:</div>
          <div>Ctrl + 1-6: Quick navigation</div>
          <div>Escape: Close sidebar</div>
        </div>
      );
    }
    return null;
  }, []);

  return (
    <div className="flex flex-col w-full h-screen bg-white shadow-md rounded-lg relative overflow-hidden">
      {/* Fixed Title Card - Optimized */}
      <ErrorBoundary>
        <div className="w-full h-28 bg-white mb-2 flex-shrink-0 relative z-10 border-b border-gray-100">
          <TitleCard />
        </div>
      </ErrorBoundary>
      
      {/* Main Content Area */}
      <div className="flex flex-row w-full bg-white rounded-lg flex-1 min-h-0 relative">
        {/* Sidebar Toggle Button */}
        {SidebarToggle}

        {/* Optimized Sidebar */}
        <nav
          id="sidebar-navigation"
          className={`
            ${sidebarCollapsed ? 'hidden' : 'lg:w-1/2'} 
            ${sidebarCollapsed ? 'max-lg:hidden' : 'max-lg:translate-x-0'}
            fixed lg:relative top-0 left-0 h-full w-[28rem] lg:w-auto
            pt-16 p-4 flex-shrink-0 overflow-y-auto scrollbar-hide 
            bg-white max-lg:bg-opacity-95 lg:bg-opacity-100 border-r border-gray-200 z-40
            transform transition-transform duration-300 ease-in-out
            max-lg:shadow-2xl backdrop-blur-sm
          `}
          aria-hidden={sidebarCollapsed}
          role="navigation"
          aria-label="Main navigation"
        >
          <ErrorBoundary>
            <SideBar 
              onNavigate={handleNavigate} 
              activeItem={activeComponent}
            />
          </ErrorBoundary>
        </nav>

        {/* Mobile Overlay */}
        {!sidebarCollapsed && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-30 z-30 transition-opacity duration-300"
            onClick={() => setSidebarCollapsed(true)}
            aria-hidden="true"
            role="presentation"
          />
        )}
        
        {/* Optimized Content Area */}
        <main 
          className={`
            flex-1 overflow-y-auto scrollbar-hide transition-all duration-300 ease-in-out bg-gray-50
            ${sidebarCollapsed ? 'w-full' : ''}
          `}
          role="main"
          aria-label={`${componentRegistry[activeComponent]?.displayName || 'Dashboard'} content`}
        >
          <div className="min-h-full relative">
            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <ComponentLoader 
                  componentName={componentRegistry[activeComponent]?.displayName}
                  size="medium"
                />
              </div>
            )}
            
            {/* Main content */}
            <div className={`transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              {CurrentComponent}
            </div>
          </div>
        </main>
      </div>

      {/* Development keyboard shortcuts helper */}
      {keyboardShortcuts}
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
