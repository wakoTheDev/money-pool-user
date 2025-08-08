/**
 * Enhanced Feature Types for Comprehensive Chama Management Platform
 * Defines all types for the comprehensive feature set
 */

// Base Component Props Interface
export interface ModuleComponentProps {
  chamaId: string;
  memberId?: string;
  permissions?: string[];
  viewMode?: 'grid' | 'list' | 'card';
  showFilters?: boolean;
  showSearch?: boolean;
  allowBulkActions?: boolean;
  onNavigate?: (path: string) => void;
  onUpdate?: (data: any) => void;
  onError?: (error: Error) => void;
}

// 1. MEMBER MANAGEMENT SYSTEM TYPES
export interface MemberProfile {
  id: string;
  membershipNumber: string;
  profile: {
    firstName: string;
    lastName: string;
    fullName: string;
    photo?: string;
    idNumber: string;
    phone: string;
    email: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    address: {
      street?: string;
      city: string;
      county: string;
      postalCode?: string;
      country: string;
    };
    nextOfKin: {
      name: string;
      relationship: string;
      phone: string;
      email?: string;
      idNumber?: string;
    };
  };
  membership: {
    role: 'chairman' | 'secretary' | 'treasurer' | 'member' | 'committee';
    status: 'active' | 'suspended' | 'exited' | 'deceased' | 'pending';
    joinDate: string;
    exitDate?: string;
    referredBy?: string;
    chamaMemberships: string[];
    votingRights: boolean;
    shareBalance: number;
    savingsBalance: number;
    loanBalance: number;
  };
  kyc: {
    status: 'pending' | 'verified' | 'rejected' | 'expired';
    documents: {
      idCopy?: string;
      photoUrl?: string;
      signatureUrl?: string;
    };
    verifiedBy?: string;
    verificationDate?: string;
  };
  communication: {
    preferences: {
      sms: boolean;
      email: boolean;
      push: boolean;
      whatsapp: boolean;
      ussd: boolean;
    };
    language: 'en' | 'sw' | 'local';
    timezone: string;
  };
  performance: {
    contributionScore: number;
    attendanceRate: number;
    creditScore: number;
    performanceRank: number;
    lastActivity: string;
  };
  privacy: {
    showBalance: boolean;
    showProfile: boolean;
    allowContact: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// 2. CONTRIBUTION MANAGEMENT SYSTEM TYPES
export interface ContributionType {
  id: string;
  name: string;
  description: string;
  type: 'regular' | 'special_levy' | 'penalty' | 'registration' | 'share_purchase' | 'emergency_fund' | 'project_specific';
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'one_time';
  mandatory: boolean;
  deadline: string;
  penalties: {
    latePaymentFee: number;
    gracePeriodDays: number;
    compoundDaily: boolean;
  };
  isActive: boolean;
}

export interface ContributionPayment {
  id: string;
  memberId: string;
  contributionTypeId: string;
  amount: number;
  paymentMethod: 'mpesa' | 'bank_transfer' | 'cash' | 'check' | 'other';
  transactionId?: string;
  paymentDate: string;
  dueDate: string;
  status: 'pending' | 'confirmed' | 'failed' | 'reversed';
  penalties: number;
  receiptNumber: string;
  processedBy: string;
  notes?: string;
  reconciliationStatus: 'pending' | 'reconciled' | 'disputed';
}

// 3. FINANCIAL MANAGEMENT SYSTEM TYPES
export interface AccountingEntry {
  id: string;
  date: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  reference: string;
  entryType: 'journal' | 'contribution' | 'loan' | 'expense' | 'investment';
  createdBy: string;
  approvedBy?: string;
  status: 'draft' | 'approved' | 'posted';
}

export interface FinancialReport {
  id: string;
  reportType: 'balance_sheet' | 'income_statement' | 'cash_flow' | 'member_statement' | 'trial_balance';
  period: {
    startDate: string;
    endDate: string;
  };
  data: any;
  generatedBy: string;
  generatedAt: string;
  status: 'draft' | 'final' | 'audited';
}

// 4. LOAN MANAGEMENT SYSTEM TYPES
export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  interestType: 'fixed' | 'reducing_balance' | 'flat_rate';
  maxTermMonths: number;
  guarantorsRequired: number;
  collateralRequired: boolean;
  eligibilityCriteria: {
    minSavingsMultiple: number;
    minMembershipMonths: number;
    maxActiveLoans: number;
    minCreditScore: number;
  };
  fees: {
    processingFee: number;
    insuranceFee: number;
    legalFee: number;
  };
  isActive: boolean;
}

export interface LoanApplication {
  id: string;
  applicantId: string;
  loanProductId: string;
  amount: number;
  termMonths: number;
  purpose: string;
  guarantors: {
    memberId: string;
    guaranteedAmount: number;
    status: 'pending' | 'accepted' | 'declined';
    acceptedAt?: string;
  }[];
  collateral?: {
    type: string;
    description: string;
    estimatedValue: number;
    documents: string[];
  };
  applicationDate: string;
  status: 'draft' | 'submitted' | 'under_review' | 'committee_review' | 'approved' | 'rejected' | 'disbursed';
  approvalWorkflow: {
    step: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: string;
    comments?: string;
  }[];
  creditScore: number;
  riskAssessment: {
    score: number;
    factors: string[];
    recommendation: 'approve' | 'reject' | 'conditional';
  };
}

export interface Document{
    id: string;
    name: string;
    type: 'pdf' | 'docx' | 'xlsx' | 'image' | 'video';
    url: string;
    uploadedBy: string;
    uploadedAt: string;
}

// 5. MEETING MANAGEMENT SYSTEM TYPES
export interface Meeting {
  date: string | number | Date;
  time: any;
  location: any;
  duration: any;
  attendees: any;
  invitees: any;
  requiresQuorum: any;
  quorumPercentage: any;
  meetingLink: any;
  id: string;
  title: string;
  description: string;
  type: 'regular' | 'emergency' | 'agm' | 'committee' | 'training';
  scheduledDate: string;
  venue: {
    type: 'physical' | 'virtual' | 'hybrid';
    location?: string;
    coordinates?: { lat: number; lng: number };
    virtualLink?: string;
  };
  agenda: {
    title: any;
    duration: any;
    id: string;
    item: string;
    presenter: string;
    timeAllocation: number;
    documents?: string[];
  }[];
  attendance: {
    memberId: string;
    status: 'present' | 'absent' | 'late';
    checkInTime?: string;
    checkInMethod?: 'qr_code' | 'manual' | 'auto';
  }[];
  minutes: {
    discussions: {
      agendaItemId: string;
      notes: string;
      presenter: string;
    }[];
    decisions: {
      description: string;
      votesFor: number;
      votesAgainst: number;
      abstentions: number;
      outcome: 'passed' | 'failed';
    }[];
    actionItems: {
      id: string;
      description: string;
      assignedTo: string;
      dueDate: string;
      status: 'pending' | 'in_progress' | 'completed';
    }[];
  };
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  recordingUrl?: string;
  documents: Document[];
}

// 6. GOVERNANCE & TRANSPARENCY TYPES
export interface Voting {
  id: string;
  title: string;
  description: string;
  type: 'resolution' | 'election' | 'amendment' | 'referendum';
  options: {
    votes: any;
    id: string;
    text: string;
    description?: string;
  }[];
  eligibleVoters: string[];
  startDate: string;
  endDate: string;
  allowProxy: boolean;
  anonymousVoting: boolean;
  votes: {
    memberId: string;
    optionId: string;
    timestamp: string;
    isProxy: boolean;
    proxyFor?: string;
  }[];
  results: {
    optionId: string;
    voteCount: number;
    percentage: number;
  }[];
  status: 'draft' | 'active' | 'completed' | 'cancelled';
}

export interface AuditTrail {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  ipAddress: string;
  userAgent: string;
  sessionId: string;
}

// 7. BUSINESS INTELLIGENCE & ANALYTICS TYPES
export interface AnalyticsData {
  memberAnalytics: {
    totalMembers: number;
    activeMembers: number;
    memberGrowthRate: number;
    churnRate: number;
    averageLifetimeValue: number;
    demographicBreakdown: {
      ageGroups: { range: string; count: number }[];
      genderDistribution: { gender: string; count: number }[];
      locationDistribution: { location: string; count: number }[];
    };
    behaviorMetrics: {
      averageContributionConsistency: number;
      meetingAttendanceRate: number;
      loanRepaymentRate: number;
      engagementScore: number;
    };
  };
  financialAnalytics: {
    totalContributions: number;
    totalLoansIssued: number;
    totalSavings: number;
    monthlyGrowthRate: number;
    profitability: number;
    cashFlowTrends: {
      period: string;
      inflow: number;
      outflow: number;
      netFlow: number;
    }[];
    investmentPerformance: {
      portfolioValue: number;
      roi: number;
      riskScore: number;
    };
  };
  operationalAnalytics: {
    meetingMetrics: {
      averageAttendance: number;
      meetingFrequency: number;
      decisionEfficiency: number;
    };
    adminEfficiency: {
      processingTime: { process: string; averageTime: number }[];
      automationRate: number;
      errorRate: number;
    };
    memberSatisfaction: {
      score: number;
      feedbackCount: number;
      complaintResolutionTime: number;
    };
  };
}

// 8. INTEGRATION & ECOSYSTEM TYPES
export interface PaymentGateway {
  id: string;
  name: string;
  type: 'mpesa' | 'bank' | 'crypto' | 'international';
  configuration: {
    apiKey: string;
    secretKey: string;
    callbackUrl: string;
    environment: 'sandbox' | 'production';
  };
  isActive: boolean;
  supportedCurrencies: string[];
  transactionFees: {
    percentage: number;
    fixedAmount: number;
    minimumFee: number;
    maximumFee: number;
  };
}

export interface APIIntegration {
  id: string;
  name: string;
  type: 'payment' | 'accounting' | 'crb' | 'government' | 'insurance' | 'other';
  baseUrl: string;
  authentication: {
    type: 'api_key' | 'oauth' | 'basic_auth';
    credentials: any;
  };
  rateLimits: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  webhooks: {
    url: string;
    events: string[];
    secret: string;
  }[];
  isActive: boolean;
}

// 9. SECURITY & COMPLIANCE TYPES
export interface SecurityConfiguration {
  authentication: {
    requireTwoFactor: boolean;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      maxAge: number;
    };
    biometricEnabled: boolean;
    sessionTimeout: number;
  };
  dataProtection: {
    encryptionEnabled: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    retentionPeriod: number;
    anonymizationRules: {
      field: string;
      method: string;
      conditions: any[];
    }[];
  };
  compliance: {
    gdprEnabled: boolean;
    dataProtectionOfficer: string;
    auditSchedule: string;
    regulatoryReporting: boolean;
  };
}

// 10. UI COMPONENT PROPS TYPES
export interface DashboardMetrics {
  totalMembers: number;
  activeMembers: number;
  totalContributions: number;
  pendingContributions: number;
  totalLoans: number;
  activeLoans: number;
  totalSavings: number;
  monthlyGrowthRate: number;
  contributionRate: number;
  loanDefaultRate: number;
  lastUpdated: string;
}

export interface NotificationSettings {
  sms: {
    enabled: boolean;
    provider: string;
    apiKey: string;
    senderId: string;
  };
  email: {
    enabled: boolean;
    provider: string;
    smtpConfig: {
      host: string;
      port: number;
      secure: boolean;
      username: string;
      password: string;
    };
  };
  push: {
    enabled: boolean;
    fcmKey: string;
    apnsKey: string;
  };
  whatsapp: {
    enabled: boolean;
    businessAccountId: string;
    accessToken: string;
  };
}

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense' | 'investment' | 'transfer';
  category: string;
  amount: number;
  description: string;
  date: string;
  memberId: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: 'cash' | 'bank_transfer' | 'mobile_money' | 'check';
  accountId: string;
  tags: string[];
  attachments: string[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
  period: string;
  type: 'expense' | 'investment';
  description: string;
}

export interface ModuleComponentProps {
  chamaId: string;
  permissions?: string[];
  onNavigate?: (route: string) => void;
  onUpdate?: (data: any) => void;
}