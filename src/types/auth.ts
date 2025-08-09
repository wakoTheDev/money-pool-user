/**
 * Authentication and Authorization Types
 */

// User roles and permissions
export type UserRole = 'super_admin' | 'platform_admin' | 'group_admin' | 'group_leader' | 'member';
export type ChamaType = 'savings' | 'investment' | 'merry_go_round' | 'table_banking' | 'other';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'pending' | 'inactive';
  emailVerified: boolean;
  phoneVerified: boolean;
  profilePhoto?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  chamaId?: string;
  permissions: string[];
}

// Authentication state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Login/Registration forms
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  role?: UserRole;
  chamaId?: string;
}

// Group registration
export interface GroupRegistrationData {
  groupName: string;
  description: string;
  category: 'savings' | 'investment' | 'merry_go_round' | 'table_banking' | 'other';
  meetingFrequency: 'weekly' | 'bi_weekly' | 'monthly' | 'quarterly';
  contributionAmount: number;
  currency: string;
  maxMembers: number;
  registrationFee: number;
  location: {
    county: string;
    constituency: string;
    ward: string;
    address?: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    alternativePhone?: string;
  };
  leaderInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    idNumber: string;
  };
  documents: {
    constitution?: File;
    registrationCertificate?: File;
    leaderIdCopy?: File;
  };
  termsAccepted?: boolean;
  dataPrivacyAccepted?: boolean;
}

// Group verification status
export interface GroupVerificationStatus {
  id: string;
  groupId: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended';
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
  documentsVerified: boolean;
  leaderVerified: boolean;
  complianceChecked: boolean;
  approvalDate?: string;
  licenseNumber?: string;
}

// Admin dashboard stats
export interface AdminStats {
  totalGroups: number;
  pendingVerifications: number;
  activeGroups: number;
  totalMembers: number;
  totalTransactions: number;
  totalVolume: number;
  growthMetrics: {
    groupsThisMonth: number;
    membersThisMonth: number;
    volumeThisMonth: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'group_registered' | 'group_verified' | 'member_joined' | 'transaction';
    description: string;
    timestamp: string;
    groupId?: string;
    userId?: string;
  }>;
}

// Database administration
export interface DatabaseBackup {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  type: 'full' | 'incremental';
  status: 'completed' | 'in_progress' | 'failed';
  downloadUrl?: string;
}

export interface SystemHealth {
  database: {
    status: 'healthy' | 'warning' | 'critical';
    responseTime: number;
    connections: number;
    maxConnections: number;
  };
  storage: {
    used: number;
    available: number;
    percentage: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  uptime: number;
  lastBackup: string;
}
