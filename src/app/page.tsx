"use client";

import React, { Suspense, useMemo } from "react";
import dynamic from "next/dynamic";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import AuthRouter from "@/components/auth/AuthRouter";

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

// Main platform component (requires authentication)
const MoneyPoolPlatform: React.FC = () => {
  const { user, isAuthenticated, logout, hasPermission } = useAuth();
  const [showAdminDashboard, setShowAdminDashboard] = React.useState(false);

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

  const handleLogout = () => {
    logout();
  };

  const handleShowAdminDashboard = () => {
    setShowAdminDashboard(true);
  };

  const handleCloseAdminDashboard = () => {
    setShowAdminDashboard(false);
  };

  // Show authentication if not logged in
  if (!isAuthenticated || !user) {
    return <AuthRouter onAuthSuccess={() => {}} />;
  }

  // Show admin dashboard if requested and user has permission
  if (showAdminDashboard && hasPermission('admin_access')) {
    const AdminDashboard = dynamic(() => import("@/components/admin/AdminDashboard"), { ssr: false });
    return <AdminDashboard onClose={handleCloseAdminDashboard} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Platform Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">MoneyPool Platform</h1>
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Production
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.firstName}! ({user.role})
              </span>
              
              {hasPermission('admin_access') && (
                <button
                  onClick={handleShowAdminDashboard}
                  className="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <i className="fas fa-cog mr-2"></i>
                  Admin Dashboard
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Content */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading platform...</p>
          </div>
        </div>
      }>
        <Dashboard 
          enhanced={true}
          userId={user.id}
          userPermissions={enhancedConfig.permissions}
          chamaId={user.chamaId || "default-chama"}
        />
      </Suspense>
    </div>
  );
};

// Main Home component with authentication provider
export default function Home() {
  return (
    <AuthProvider children={""}>
      <MoneyPoolPlatform />
    </AuthProvider>
  );
}
