/**
 * Authentication Router Component
 * Manages routing between different authentication states
 */

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Login from '@/components/auth/Login';
import MemberRegistration from '@/components/auth/MemberRegistration';
import GroupRegistration from '@/components/auth/GroupRegistration';
import AdminDashboard from '@/components/admin/AdminDashboard';

type AuthView = 'login' | 'member-register' | 'group-register' | 'admin-dashboard';

interface AuthRouterProps {
  initialView?: AuthView;
  onAuthSuccess?: () => void;
}

const AuthRouter: React.FC<AuthRouterProps> = ({ 
  initialView = 'login', 
  onAuthSuccess 
}) => {
  const { user, isAuthenticated, hasPermission } = useAuth();
  const [currentView, setCurrentView] = useState<AuthView>(initialView);

  // If user is authenticated and has admin permissions, they can access admin dashboard
  if (isAuthenticated && user) {
    if (currentView === 'admin-dashboard' && hasPermission('admin_access')) {
      return (
        <AdminDashboard 
          onClose={() => {
            setCurrentView('login');
            onAuthSuccess?.();
          }}
        />
      );
    }
    
    // If authenticated but not in admin view, call success callback
    if (currentView !== 'admin-dashboard') {
      onAuthSuccess?.();
      return null;
    }
  }

  const handleLoginSuccess = () => {
    if (user && hasPermission('admin_access')) {
      setCurrentView('admin-dashboard');
    } else {
      onAuthSuccess?.();
    }
  };

  const handleRegistrationSuccess = () => {
    setCurrentView('login');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleSwitchToMemberRegister = () => {
    setCurrentView('member-register');
  };

  const handleSwitchToGroupRegister = () => {
    setCurrentView('group-register');
  };

  switch (currentView) {
    case 'login':
      return (
        <Login
          onSuccess={handleLoginSuccess}
          onSwitchToMemberRegister={handleSwitchToMemberRegister}
          onSwitchToGroupRegister={handleSwitchToGroupRegister}
        />
      );

    case 'member-register':
      return (
        <MemberRegistration
          onSuccess={handleRegistrationSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      );

    case 'group-register':
      return (
        <GroupRegistration
          onSuccess={handleRegistrationSuccess}
          onCancel={handleSwitchToLogin}
        />
      );

    case 'admin-dashboard':
      if (hasPermission('admin_access')) {
        return (
          <AdminDashboard 
            onClose={() => setCurrentView('login')}
          />
        );
      } else {
        // Fallback to login if no admin access
        setCurrentView('login');
        return (
          <Login
            onSuccess={handleLoginSuccess}
            onSwitchToMemberRegister={handleSwitchToMemberRegister}
            onSwitchToGroupRegister={handleSwitchToGroupRegister}
          />
        );
      }

    default:
      return (
        <Login
          onSuccess={handleLoginSuccess}
          onSwitchToMemberRegister={handleSwitchToMemberRegister}
          onSwitchToGroupRegister={handleSwitchToGroupRegister}
        />
      );
  }
};

export default AuthRouter;
