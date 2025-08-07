/**
 * Application constants and configuration
 * Centralized place for all app-wide constants
 */

// App Configuration
export const APP_CONFIG = {
  name: 'MoneyPool',
  description: 'Complete digital platform for Kenyan savings groups',
  version: '1.0.0',
  author: 'MoneyPool Team',
} as const;

// Theme Colors
export const THEME_COLORS = {
  primary: '#2E7D32',
  primaryHover: '#1B5E20',
  secondary: '#4CAF50',
  accent: '#FFC107',
  danger: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  success: '#4CAF50',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000,
  retryAttempts: 3,
  endpoints: {
    auth: '/auth',
    members: '/members',
    contributions: '/contributions',
    loans: '/loans',
    meetings: '/meetings',
    reports: '/reports',
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  authToken: 'moneypool_auth_token',
  refreshToken: 'moneypool_refresh_token',
  userPreferences: 'moneypool_user_preferences',
  chamaData: 'moneypool_chama_data',
  dashboardState: 'moneypool_dashboard_state',
} as const;

// Form Validation Rules
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+254|0)[7-9]\d{8}$/,
  minPasswordLength: 8,
  maxNameLength: 50,
  maxDescriptionLength: 500,
} as const;

// Pagination Configuration
export const PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 100,
  pageSizeOptions: [10, 25, 50, 100],
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// Date Formats
export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  input: 'yyyy-MM-dd',
  timestamp: 'yyyy-MM-dd HH:mm:ss',
} as const;

// Chart Colors for Recharts
export const CHART_COLORS = [
  '#2E7D32',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
] as const;

// Default Chama Configuration
export const DEFAULT_CHAMA_CONFIG = {
  contributionCategories: [
    { id: 1, name: 'Monthly Savings', target: 5000, mandatory: true, color: '#10b981' },
    { id: 2, name: 'Emergency Fund', target: 2000, mandatory: true, color: '#ef4444' },
    { id: 3, name: 'Investment Fund', target: 3000, mandatory: false, color: '#3b82f6' },
    { id: 4, name: 'Social Fund', target: 1000, mandatory: false, color: '#f59e0b' },
    { id: 5, name: 'Welfare Fund', target: 1500, mandatory: true, color: '#8b5cf6' },
    { id: 6, name: 'Development Projects', target: 2500, mandatory: false, color: '#06b6d4' },
  ],
  meetingFrequency: 'monthly',
  defaultMeetingDuration: 120, // minutes
  maxLoanAmount: 50000,
  loanInterestRate: 0.1, // 10%
  defaultLoanTerm: 12, // months
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  sessionExpired: 'Your session has expired. Please log in again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  saved: 'Changes saved successfully!',
  created: 'Created successfully!',
  updated: 'Updated successfully!',
  deleted: 'Deleted successfully!',
  uploaded: 'File uploaded successfully!',
} as const;

// Contribution specific constants
export const CONTRIBUTION_STATUSES = ['completed', 'pending', 'overdue'] as const;
export type ContributionStatus = typeof CONTRIBUTION_STATUSES[number];

// Payment methods
export const PAYMENT_METHODS = ['cash', 'bank', 'mobile', 'check'] as const;
export type PaymentMethod = typeof PAYMENT_METHODS[number];

// Loan statuses
export const LOAN_STATUSES = ['active', 'paid', 'overdue', 'defaulted'] as const;
export type LoanStatus = typeof LOAN_STATUSES[number];

// Meeting statuses
export const MEETING_STATUSES = ['scheduled', 'ongoing', 'completed', 'cancelled'] as const;
export type MeetingStatus = typeof MEETING_STATUSES[number];
