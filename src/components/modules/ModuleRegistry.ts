/**
 * Enhanced Module Registry
 * Central registry for all enhanced Chama Management Platform modules
 */

import React from 'react';
import { ModuleComponentProps } from '@/types/enhanced-features';

// Import enhanced modules only
const EnhancedMemberManagement = React.lazy(() => import('./EnhancedMemberManagement'));
const EnhancedContributionManagement = React.lazy(() => import('./EnhancedContributionManagement'));
const EnhancedLoanManagement = React.lazy(() => import('./EnhancedLoanManagement'));
const EnhancedFinancialManagement = React.lazy(() => import('./EnhancedFinancialManagement'));
const EnhancedMeetingManagement = React.lazy(() => import('./EnhancedMeetingManagement'));

// Module registry with metadata
export interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: React.LazyExoticComponent<React.ComponentType<ModuleComponentProps>>;
  category: 'core' | 'financial' | 'governance' | 'analytics' | 'communication';
  permissions: string[];
  features: string[];
  status: 'stable' | 'beta' | 'development';
}

export const MODULE_REGISTRY: Record<string, ModuleInfo> = {
  // Enhanced Core Modules
  'enhanced-members': {
    id: 'enhanced-members',
    name: 'Enhanced Member Management',
    description: 'Next-generation member lifecycle management with advanced KYC, performance analytics, and communication hub',
    icon: 'faUsers',
    component: EnhancedMemberManagement,
    category: 'core',
    permissions: ['members.view', 'members.create', 'members.edit', 'members.delete', 'members.kyc', 'members.analytics'],
    features: [
      'Advanced Member Registration Workflow',
      'Digital KYC & Identity Verification',
      'Real-time Performance Analytics',
      'Automated Role & Permission Management',
      'Integrated Communication Hub',
      'Digital Membership Certificates',
      'Multi-Chama Support with Cross-referencing',
      'AI-Powered Member Insights',
      'Bulk Member Operations',
      'Member Journey Tracking'
    ],
    status: 'beta'
  },

  'enhanced-contributions': {
    id: 'enhanced-contributions',
    name: 'Enhanced Contribution Management',
    description: 'Advanced contribution tracking with intelligent payment processing, predictive analytics, and automation',
    icon: 'faMoneyBillWave',
    component: EnhancedContributionManagement,
    category: 'financial',
    permissions: ['contributions.view', 'contributions.create', 'contributions.edit', 'contributions.process', 'contributions.analytics'],
    features: [
      'Multiple Contribution Types & Categories',
      'Intelligent Payment Processing',
      'Advanced M-Pesa & Bank Integration',
      'Smart Payment Scheduling & Reminders',
      'Predictive Contribution Analytics',
      'Automated Late Payment Management',
      'Bulk Payment Processing & Reconciliation',
      'Advanced Reporting & Export',
      'Payment Gateway Integration',
      'Automated Contribution Reconciliation'
    ],
    status: 'beta'
  },

  'enhanced-loans': {
    id: 'enhanced-loans',
    name: 'Enhanced Loan Management',
    description: 'Comprehensive loan lifecycle management with AI-powered risk assessment and automated workflows',
    icon: 'faHandHoldingUsd',
    component: EnhancedLoanManagement,
    category: 'financial',
    permissions: ['loans.view', 'loans.apply', 'loans.approve', 'loans.disburse', 'loans.collect', 'loans.analytics'],
    features: [
      'Dynamic Loan Product Configuration',
      'AI-Powered Digital Application Process',
      'Intelligent Multi-Level Approval Workflow',
      'Advanced Guarantor Management System',
      'Automated Repayment Tracking & Collection',
      'Machine Learning Credit Scoring',
      'Advanced Loan Calculator & Simulation',
      'Intelligent Collection & Recovery Tools',
      'Loan Portfolio Analytics',
      'Risk Assessment Dashboard'
    ],
    status: 'beta'
  },

  'enhanced-financial': {
    id: 'enhanced-financial',
    name: 'Enhanced Financial Management',
    description: 'Comprehensive financial tracking, budgeting, and investment management with real-time analytics',
    icon: 'faCoins',
    component: EnhancedFinancialManagement,
    category: 'financial',
    permissions: ['finance.view', 'finance.create', 'finance.edit', 'finance.budget', 'finance.reports'],
    features: [
      'Multi-Account Financial Tracking',
      'Advanced Budgeting & Forecasting',
      'Real-time Transaction Processing',
      'Investment Portfolio Management',
      'Automated Bank Reconciliation',
      'Financial Analytics & Reporting',
      'Cash Flow Management',
      'Expense Category Management',
      'Financial Goal Tracking',
      'Tax Management & Reporting'
    ],
    status: 'beta'
  },

  'enhanced-meetings': {
    id: 'enhanced-meetings',
    name: 'Enhanced Meeting Management',
    description: 'Complete meeting lifecycle management with governance tools, attendance tracking, and virtual meeting support',
    icon: 'faCalendarAlt',
    component: EnhancedMeetingManagement,
    category: 'governance',
    permissions: ['meetings.view', 'meetings.create', 'meetings.edit', 'meetings.attend', 'meetings.vote'],
    features: [
      'Smart Meeting Scheduling',
      'Hybrid Meeting Support (Physical/Virtual)',
      'Real-time Attendance Tracking',
      'Electronic Voting & Governance',
      'Automated Meeting Minutes',
      'Agenda Management & Time Tracking',
      'Quorum Management',
      'Meeting Analytics & Insights',
      'Integration with Calendar Systems',
      'Meeting Recording & Playback'
    ],
    status: 'beta'
  }
};

// Module categories
export const MODULE_CATEGORIES = {
  core: {
    name: 'Core Management',
    description: 'Essential chama management functions',
    color: 'blue'
  },
  financial: {
    name: 'Financial Management',
    description: 'Money management and financial operations',
    color: 'green'
  },
  governance: {
    name: 'Governance & Meetings',
    description: 'Democratic processes and meeting management',
    color: 'purple'
  },
  analytics: {
    name: 'Analytics & Reporting',
    description: 'Business intelligence and insights',
    color: 'indigo'
  },
  communication: {
    name: 'Communication & Alerts',
    description: 'Member communication and notifications',
    color: 'pink'
  }
};

// Permission checker utility
export const hasModulePermission = (userPermissions: string[], moduleId: string): boolean => {
  const module = MODULE_REGISTRY[moduleId];
  if (!module) return false;
  
  return module.permissions.some(permission => userPermissions.includes(permission));
};

// Get modules by category
export const getModulesByCategory = (category: keyof typeof MODULE_CATEGORIES): ModuleInfo[] => {
  return Object.values(MODULE_REGISTRY).filter(module => module.category === category);
};

// Get available modules for user
export const getAvailableModules = (userPermissions: string[]): ModuleInfo[] => {
  return Object.values(MODULE_REGISTRY).filter(module => 
    hasModulePermission(userPermissions, module.id)
  );
};

// Module feature flags
export const MODULE_FEATURES = {
  // Member Management Features
  member_kyc_verification: true,
  member_performance_tracking: true,
  member_multi_chama_support: true,
  member_digital_certificates: true,
  member_bulk_operations: true,
  
  // Enhanced Member Management Features
  enhanced_member_ai_insights: true,
  enhanced_member_journey_tracking: true,
  enhanced_member_cross_referencing: true,
  enhanced_member_automated_onboarding: true,
  
  // Contribution Management Features
  contribution_auto_reminders: true,
  contribution_mpesa_integration: true,
  contribution_bulk_processing: true,
  contribution_penalty_calculation: true,
  contribution_analytics_dashboard: true,
  
  // Enhanced Contribution Management Features
  enhanced_contribution_predictive_analytics: true,
  enhanced_contribution_smart_scheduling: true,
  enhanced_contribution_automated_reconciliation: true,
  enhanced_contribution_payment_gateway: true,
  
  // Loan Management Features
  loan_credit_scoring: true,
  loan_guarantor_system: true,
  loan_auto_approval: false, // Disabled for security
  loan_collection_automation: true,
  loan_risk_assessment: true,
  
  // Enhanced Loan Management Features
  enhanced_loan_ai_credit_scoring: true,
  enhanced_loan_intelligent_workflows: true,
  enhanced_loan_portfolio_analytics: true,
  enhanced_loan_risk_dashboard: true,
  
  // Enhanced Financial Management Features
  enhanced_financial_multi_account: true,
  enhanced_financial_budgeting: true,
  enhanced_financial_investment_tracking: true,
  enhanced_financial_automated_reconciliation: true,
  enhanced_financial_tax_management: true,
  
  // Enhanced Meeting Management Features
  enhanced_meeting_hybrid_support: true,
  enhanced_meeting_electronic_voting: true,
  enhanced_meeting_automated_minutes: true,
  enhanced_meeting_attendance_analytics: true,
  enhanced_meeting_recording: false, // Coming soon
  
  // Global Features
  real_time_notifications: true,
  audit_trail: true,
  data_export: true,
  mobile_optimization: true,
  offline_support: false, // Coming soon
  multi_language: false, // Coming soon
  ai_powered_insights: true,
  advanced_analytics: true,
  automated_workflows: true,
};

// Module status checker
export const isModuleEnabled = (moduleId: string): boolean => {
  const module = MODULE_REGISTRY[moduleId];
  return module && module.status !== 'development';
};

// Feature flag checker
export const isFeatureEnabled = (featureKey: keyof typeof MODULE_FEATURES): boolean => {
  return MODULE_FEATURES[featureKey];
};

export default MODULE_REGISTRY;
