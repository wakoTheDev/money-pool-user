/**
 * Enhanced Types
 * Type definitions for enhanced features
 */

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// Enhanced Member Types
export interface EnhancedMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'member' | 'leader' | 'treasurer' | 'secretary';
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: string;
  contributionHistory: EnhancedContribution[];
  loanHistory: EnhancedLoan[];
  totalContributions: number;
  totalLoans: number;
  creditScore: number;
  profilePicture?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Enhanced Contribution Types
export interface EnhancedContribution {
  id: string;
  memberId: string;
  amount: number;
  currency: string;
  type: 'regular' | 'special' | 'fine' | 'loan_repayment';
  status: 'pending' | 'confirmed' | 'failed';
  paymentMethod: 'cash' | 'mpesa' | 'bank_transfer' | 'card';
  transactionId?: string;
  description?: string;
  dueDate: string;
  paidDate?: string;
  confirmedBy?: string;
  receiptUrl?: string;
  category: string;
}

// Enhanced Loan Types
export interface EnhancedLoan {
  id: string;
  memberId: string;
  amount: number;
  currency: string;
  interestRate: number;
  term: number; // in months
  status: 'pending' | 'approved' | 'active' | 'completed' | 'defaulted';
  purpose: string;
  requestDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  dueDate: string;
  totalRepayment: number;
  amountRepaid: number;
  remainingBalance: number;
  guarantors: string[];
  collateral?: {
    type: string;
    value: number;
    description: string;
  };
  repaymentSchedule: LoanRepayment[];
}

export interface LoanRepayment {
  id: string;
  loanId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  principalAmount: number;
  interestAmount: number;
}

// Enhanced Meeting Types
export interface EnhancedMeeting {
  id: string;
  title: string;
  description?: string;
  type: 'regular' | 'special' | 'emergency' | 'annual';
  scheduledDate: string;
  startTime: string;
  endTime?: string;
  location: {
    type: 'physical' | 'virtual' | 'hybrid';
    address?: string;
    virtualLink?: string;
  };
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  agenda: MeetingAgendaItem[];
  attendees: MeetingAttendee[];
  minutes?: string;
  decisions: MeetingDecision[];
  attachments: string[];
}

export interface MeetingAgendaItem {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  presenter?: string;
  order: number;
}

export interface MeetingAttendee {
  memberId: string;
  status: 'invited' | 'confirmed' | 'attended' | 'absent';
  responseDate?: string;
}

export interface MeetingDecision {
  id: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  status: 'passed' | 'rejected' | 'deferred';
}

// Analytics Types
export interface AnalyticsData {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  metrics: {
    totalContributions: number;
    totalLoans: number;
    memberGrowth: number;
    averageContribution: number;
    loanDefaultRate: number;
    attendanceRate: number;
  };
  trends: {
    contributionTrend: DataPoint[];
    loanTrend: DataPoint[];
    membershipTrend: DataPoint[];
  };
}

export interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  type: 'contribution' | 'loan_disbursement' | 'loan_repayment' | 'fine' | 'expense';
  amount: number;
  currency: string;
  memberId?: string;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  transactionId?: string;
  category: string;
  receiptUrl?: string;
}

// Investment Types
export interface Investment {
  id: string;
  name: string;
  type: 'fixed_deposit' | 'money_market' | 'bonds' | 'stocks' | 'real_estate';
  amount: number;
  currency: string;
  startDate: string;
  maturityDate?: string;
  interestRate?: number;
  currentValue: number;
  expectedReturn: number;
  status: 'active' | 'matured' | 'liquidated';
  riskLevel: 'low' | 'medium' | 'high';
  description?: string;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  recipientId?: string; // if null, it's a group message
  subject?: string;
  content: string;
  type: 'announcement' | 'reminder' | 'notification' | 'chat';
  priority: 'low' | 'medium' | 'high';
  sentDate: string;
  readDate?: string;
  attachments?: string[];
  status: 'sent' | 'delivered' | 'read';
}

// Configuration Types
export interface ChamaConfiguration {
  id: string;
  name: string;
  description?: string;
  rules: ChamaRule[];
  meetingFrequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  contributionAmount: number;
  currency: string;
  fineStructure: FineRule[];
  loanRules: LoanRule[];
  maxMembers: number;
  registrationFee: number;
  settings: {
    allowPartialPayments: boolean;
    requireGuarantors: boolean;
    autoCalculateFines: boolean;
    enableNotifications: boolean;
    allowOnlinePayments: boolean;
  };
}

export interface ChamaRule {
  id: string;
  title: string;
  description: string;
  category: 'membership' | 'contributions' | 'loans' | 'meetings' | 'governance';
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

export interface FineRule {
  id: string;
  name: string;
  description: string;
  amount: number;
  type: 'fixed' | 'percentage';
  trigger: 'late_contribution' | 'missed_meeting' | 'loan_default' | 'rule_violation';
  isActive: boolean;
}

export interface LoanRule {
  id: string;
  name: string;
  maxAmount: number;
  minAmount: number;
  maxTerm: number; // in months
  interestRate: number;
  requiresGuarantor: boolean;
  requiresCollateral: boolean;
  eligibilityCriteria: string[];
  isActive: boolean;
}
