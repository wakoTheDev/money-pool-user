"use client";

import React from "react";
import EnhancedDashboard from "./modules/EnhancedDashboard";

// Dashboard Props Interface
interface DashboardProps {
  enhanced?: boolean;
  userId?: string;
  userPermissions?: string[];
  chamaId?: string;
}

const Dashboard = React.memo(({ 
  enhanced = true, 
  userId = 'user1', 
  userPermissions = [
    'members.view', 'members.create', 'members.edit', 'members.kyc', 'members.analytics',
    'contributions.view', 'contributions.create', 'contributions.edit', 'contributions.process', 'contributions.analytics',
    'loans.view', 'loans.apply', 'loans.approve', 'loans.disburse', 'loans.collect', 'loans.analytics',
    'finance.view', 'finance.create', 'finance.edit', 'finance.budget', 'finance.reports',
    'meetings.view', 'meetings.create', 'meetings.edit', 'meetings.attend', 'meetings.vote'
  ],
  chamaId = 'chama1' 
}: DashboardProps) => {
  // Always render the enhanced dashboard since legacy components have been removed
  return (
    <EnhancedDashboard 
      userId={userId}
      userPermissions={userPermissions}
      chamaId={chamaId}
    />
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
