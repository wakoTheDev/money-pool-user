"use client";

import React, { Suspense, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";

// Import the enhanced demo component
const EnhancedModuleDemo = dynamic(() => import("@/components/EnhancedModuleDemo"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading Enhanced Demo...</p>
      </div>
    </div>
  )
});

const Dashboard = dynamic(() => import("@/components/Dashboard"), {
  ssr: false,
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

// Main Home component with demo toggle
export default function Home() {
  // Enhanced Platform Demo Toggle State
  const [showDemo, setShowDemo] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Configuration for enhanced platform
  const enhancedConfig = useMemo(() => ({
    permissions: [
      'members.view', 'members.create', 'members.edit', 'members.kyc', 'members.analytics',
      'contributions.view', 'contributions.create', 'contributions.edit', 'contributions.process', 'contributions.analytics',
      'loans.view', 'loans.apply', 'loans.approve', 'loans.disburse', 'loans.collect', 'loans.analytics',
      'finance.view', 'finance.create', 'finance.edit', 'finance.budget', 'finance.reports',
      'meetings.view', 'meetings.create', 'meetings.edit', 'meetings.attend', 'meetings.vote'
    ],
    modules: {
      enhanced: true,
      analytics: true,
      automation: true,
      aiInsights: true
    }
  }), []);

  const handleToggleView = useCallback((viewType: 'demo' | 'platform') => {
    setIsLoading(true);
    setTimeout(() => {
      setShowDemo(viewType === 'demo');
      setIsLoading(false);
    }, 300);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Switching views...</p>
        </div>
      </div>
    );
  }

  if (showDemo) {
    return (
      <div className="min-h-screen bg-white">
        {/* Demo Navigation Header */}
        <div className="border-b border-gray-200 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">MoneyPool Enhanced Demo</h1>
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Demo Mode
                </span>
              </div>
              <button
                onClick={() => handleToggleView('platform')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Exit Demo
              </button>
            </div>
          </div>
        </div>

        {/* Demo Content */}
        <Suspense fallback={
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Loading enhanced demo...</p>
            </div>
          </div>
        }>
          <EnhancedModuleDemo />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Platform Selection Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">MoneyPool Platform</h1>
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Enhanced Mode
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleToggleView('demo')}
                className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i className="fas fa-play mr-2"></i>
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Platform Content */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading enhanced platform...</p>
          </div>
        </div>
      }>
        <Dashboard 
          enhanced={true}
          userId="user1"
          userPermissions={enhancedConfig.permissions}
          chamaId="chama1"
        />
      </Suspense>
    </div>
  );
}
