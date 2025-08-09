// Database types and interfaces for MoneyPool application
// Auto-generated from database schema - do not edit manually

export interface User {
  id: string;
  email: string;
  phone?: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth?: Date;
  gender?: 'male' | 'female' | 'other';
  national_id?: string;
  profile_picture_url?: string;
  
  // Account status and verification
  status: 'active' | 'suspended' | 'inactive' | 'pending';
  email_verified: boolean;
  phone_verified: boolean;
  kyc_status: 'pending' | 'verified' | 'rejected' | 'expired';
  kyc_documents?: Record<string, any>;
  
  // Security and access
  two_factor_enabled: boolean;
  two_factor_secret?: string;
  last_login?: Date;
  failed_login_attempts: number;
  account_locked_until?: Date;
  
  // Administrative
  role: 'admin' | 'super_admin' | 'group_admin' | 'member';
  permissions: string[];
  
  // Audit fields
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}

export interface Chama {
  id: string;
  name: string;
  description?: string;
  category: 'savings' | 'investment' | 'credit' | 'mixed';
  
  // Group settings
  max_members: number;
  min_contribution_amount: number;
  contribution_frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'flexible';
  contribution_day?: number;
  meeting_frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'as_needed';
  
  // Financial settings
  currency: string;
  loan_interest_rate: number;
  max_loan_multiplier: number;
  loan_grace_period: number;
  penalty_rate: number;
  
  // Group status and lifecycle
  status: 'pending' | 'active' | 'suspended' | 'dissolved' | 'inactive';
  registration_number?: string;
  registration_date?: Date;
  dissolution_date?: Date;
  
  // Location and meeting details
  location?: string;
  meeting_location?: string;
  meeting_time?: string;
  time_zone: string;
  
  // Administrative
  admin_notes?: string;
  terms_and_conditions?: string;
  constitution?: string;
  bylaws?: Record<string, any>;
  
  // Audit fields
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}

export interface ChamaMember {
  id: string;
  chama_id: string;
  user_id: string;
  
  // Membership details
  role: 'leader' | 'treasurer' | 'secretary' | 'member';
  member_number?: string;
  join_date: Date;
  leave_date?: Date;
  
  // Status and permissions
  status: 'active' | 'inactive' | 'suspended' | 'left';
  permissions: string[];
  voting_rights: boolean;
  
  // Financial tracking
  total_contributions: number;
  current_balance: number;
  outstanding_loans: number;
  penalty_balance: number;
  
  // Audit fields
  created_at: Date;
  updated_at: Date;
  created_by?: string;
}

export interface Transaction {
  id: string;
  chama_id: string;
  member_id: string;
  
  // Transaction identification
  transaction_type: 'contribution' | 'loan_disbursement' | 'loan_repayment' | 'penalty' | 'interest' | 'withdrawal' | 'fee' | 'adjustment' | 'transfer';
  transaction_number?: string;
  reference_number?: string;
  
  // Financial details
  amount: number;
  currency: string;
  fee_amount: number;
  net_amount: number;
  
  // Payment details
  payment_method?: 'cash' | 'bank_transfer' | 'mobile_money' | 'card' | 'check' | 'other';
  payment_reference?: string;
  payment_date: Date;
  
  // Transaction status and processing
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled' | 'reversed';
  confirmation_code?: string;
  failure_reason?: string;
  processed_at?: Date;
  processed_by?: string;
  
  // Categorization and tracking
  category?: string;
  description?: string;
  notes?: string;
  tags: string[];
  
  // Related entities
  related_loan_id?: string;
  related_meeting_id?: string;
  related_transaction_id?: string;
  
  // Audit fields
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}

export interface Contribution {
  id: string;
  chama_id: string;
  member_id: string;
  transaction_id?: string;
  
  // Contribution details
  contribution_type: 'regular' | 'voluntary' | 'penalty' | 'special' | 'catch_up';
  period_year: number;
  period_month?: number;
  period_week?: number;
  
  // Financial details
  expected_amount: number;
  actual_amount: number;
  variance: number;
  
  // Timing
  due_date: Date;
  paid_date?: Date;
  days_late?: number;
  
  // Status
  status: 'pending' | 'partial' | 'completed' | 'overdue' | 'waived';
  
  // Additional details
  notes?: string;
  waiver_reason?: string;
  waived_by?: string;
  waived_at?: Date;
  
  // Audit fields
  created_at: Date;
  updated_at: Date;
  created_by?: string;
}

export interface Loan {
  id: string;
  chama_id: string;
  borrower_id: string;
  
  // Loan identification
  loan_number: string;
  loan_type: 'personal' | 'business' | 'emergency' | 'development' | 'other';
  
  // Financial terms
  principal_amount: number;
  interest_rate: number;
  interest_type: 'simple' | 'compound' | 'reducing_balance';
  term_months: number;
  monthly_payment?: number;
  total_interest?: number;
  total_amount: number;
  
  // Repayment schedule
  first_payment_date: Date;
  final_payment_date: Date;
  payment_frequency: 'weekly' | 'monthly' | 'quarterly';
  grace_period_days: number;
  
  // Current status
  status: 'pending' | 'approved' | 'disbursed' | 'active' | 'completed' | 'defaulted' | 'written_off' | 'rejected';
  disbursed_amount: number;
  repaid_amount: number;
  outstanding_balance?: number;
  penalty_amount: number;
  
  // Application and approval
  application_date: Date;
  purpose: string;
  collateral_description?: string;
  guarantors: Record<string, any>[];
  
  // Approval workflow
  approved_by?: string;
  approved_at?: Date;
  approval_notes?: string;
  rejection_reason?: string;
  
  // Disbursement
  disbursed_by?: string;
  disbursed_at?: Date;
  disbursement_method?: string;
  disbursement_reference?: string;
  
  // Default and recovery
  default_date?: Date;
  recovery_actions: Record<string, any>[];
  writeoff_date?: Date;
  writeoff_amount?: number;
  writeoff_reason?: string;
  
  // Audit fields
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}

export interface LoanRepayment {
  id: string;
  loan_id: string;
  transaction_id?: string;
  
  // Payment details
  payment_number: number;
  due_date: Date;
  paid_date?: Date;
  
  // Amount breakdown
  scheduled_amount: number;
  principal_amount: number;
  interest_amount: number;
  penalty_amount: number;
  total_due: number;
  
  // Actual payment
  amount_paid: number;
  principal_paid: number;
  interest_paid: number;
  penalty_paid: number;
  
  // Status
  status: 'pending' | 'partial' | 'completed' | 'overdue' | 'waived';
  days_overdue: number;
  
  // Additional details
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
  
  // Audit fields
  created_at: Date;
  updated_at: Date;
}

export interface Meeting {
  id: string;
  chama_id: string;
  
  // Meeting details
  title: string;
  meeting_type: 'regular' | 'special' | 'annual' | 'emergency' | 'committee';
  description?: string;
  agenda: string[];
  
  // Scheduling
  scheduled_date: Date;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  time_zone: string;
  
  // Location
  location?: string;
  location_type: 'physical' | 'virtual' | 'hybrid';
  meeting_link?: string;
  
  // Status and outcomes
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  actual_start_time?: Date;
  actual_end_time?: Date;
  
  // Participation
  expected_attendees?: number;
  actual_attendees?: number;
  quorum_met?: boolean;
  quorum_percentage?: number;
  
  // Documentation
  minutes?: string;
  resolutions: Record<string, any>[];
  action_items: Record<string, any>[];
  attachments: Record<string, any>[];
  
  // Administrative
  chairperson_id?: string;
  secretary_id?: string;
  notes?: string;
  
  // Audit fields
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}

export interface MeetingAttendance {
  id: string;
  meeting_id: string;
  member_id: string;
  
  // Attendance details
  status: 'expected' | 'present' | 'absent' | 'excused' | 'late';
  arrival_time?: Date;
  departure_time?: Date;
  
  // Participation
  contributed_to_discussions: boolean;
  voted_on_resolutions: boolean;
  
  // Additional details
  excuse_reason?: string;
  notes?: string;
  
  // Audit fields
  created_at: Date;
  updated_at: Date;
}

export interface Goal {
  id: string;
  chama_id: string;
  created_by: string;
  
  // Goal details
  title: string;
  description?: string;
  goal_type?: 'savings' | 'investment' | 'loan_disbursement' | 'membership' | 'project' | 'other';
  category?: string;
  
  // Targets
  target_amount?: number;
  current_amount: number;
  target_date?: Date;
  
  // Progress tracking
  status: 'active' | 'completed' | 'paused' | 'cancelled' | 'overdue';
  progress_percentage: number;
  
  // Milestones
  milestones: Record<string, any>[];
  completed_milestones: Record<string, any>[];
  
  // Audit fields
  created_at: Date;
  updated_at: Date;
  updated_by?: string;
}

export interface Investment {
  id: string;
  chama_id: string;
  
  // Investment details
  name: string;
  investment_type: 'stocks' | 'bonds' | 'real_estate' | 'mutual_funds' | 'fixed_deposit' | 'business' | 'other';
  description?: string;
  
  // Financial details
  initial_investment: number;
  current_value?: number;
  total_invested: number;
  total_returns: number;
  unrealized_gains: number;
  realized_gains: number;
  
  // Performance metrics
  roi_percentage: number;
  
  // Investment lifecycle
  purchase_date: Date;
  maturity_date?: Date;
  status: 'active' | 'sold' | 'matured' | 'defaulted' | 'suspended';
  
  // External tracking
  broker_name?: string;
  account_number?: string;
  certificate_number?: string;
  
  // Risk and compliance
  risk_level?: 'low' | 'medium' | 'high' | 'very_high';
  compliance_status: string;
  
  // Documentation
  documents: Record<string, any>[];
  notes?: string;
  
  // Audit fields
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}

export interface Notification {
  id: string;
  chama_id?: string;
  user_id?: string;
  
  // Notification content
  title: string;
  message: string;
  notification_type: 'info' | 'warning' | 'error' | 'success' | 'reminder' | 'announcement';
  category?: string;
  
  // Delivery
  channels: ('app' | 'email' | 'sms' | 'push')[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Status
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  sent_at?: Date;
  read_at?: Date;
  
  // Context
  related_entity_type?: string;
  related_entity_id?: string;
  action_url?: string;
  
  // Metadata
  metadata: Record<string, any>;
  expires_at?: Date;
  
  // Audit fields
  created_at: Date;
  updated_at: Date;
  created_by?: string;
}

export interface Report {
  id: string;
  chama_id?: string;
  
  // Report details
  name: string;
  report_type: 'financial' | 'membership' | 'attendance' | 'loans' | 'investments' | 'custom' | 'regulatory';
  description?: string;
  
  // Parameters
  parameters: Record<string, any>;
  date_from?: Date;
  date_to?: Date;
  
  // Generation
  status: 'pending' | 'generating' | 'completed' | 'failed';
  file_path?: string;
  file_format?: 'pdf' | 'excel' | 'csv' | 'json';
  file_size?: number;
  
  // Access and sharing
  is_public: boolean;
  shared_with: string[];
  download_count: number;
  
  // Audit fields
  generated_by: string;
  generated_at: Date;
  expires_at?: Date;
}

export interface SystemSetting {
  id: string;
  chama_id?: string;
  
  // Setting details
  setting_key: string;
  setting_value: any;
  setting_type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  
  // Metadata
  category?: string;
  description?: string;
  is_encrypted: boolean;
  is_system: boolean;
  
  // Validation
  validation_rules: Record<string, any>;
  
  // Audit fields
  created_at: Date;
  updated_at: Date;
  updated_by?: string;
}

export interface AuditLog {
  id: string;
  chama_id?: string;
  
  // Event details
  event_type: string;
  entity_type: string;
  entity_id: string;
  
  // Changes
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'suspend' | 'activate';
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  changed_fields: string[];
  
  // Context
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  request_id?: string;
  
  // Administrative
  notes?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  
  // Audit fields
  performed_by?: string;
  performed_at: Date;
}

// View types for common aggregations
export interface ChamaSummary {
  id: string;
  name: string;
  category: string;
  status: string;
  created_at: Date;
  total_members: number;
  active_members: number;
  total_contributions: number;
  total_outstanding_loans: number;
  total_balances: number;
}

export interface MemberFinancialSummary {
  chama_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
  join_date: Date;
  total_contributions: number;
  current_balance: number;
  outstanding_loans: number;
  total_loans: number;
  active_loans: number;
  active_loan_balance: number;
}

export interface RecentTransaction {
  id: string;
  chama_id: string;
  chama_name: string;
  member_id: string;
  member_name: string;
  transaction_type: string;
  amount: number;
  currency: string;
  payment_method?: string;
  status: string;
  description?: string;
  payment_date: Date;
  created_at: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Authentication types
export interface AuthUser extends Omit<User, 'password_hash'> {
  permissions: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  refresh_token?: string;
  expires_at: Date;
}

// Dashboard types
export interface DashboardStats {
  total_chamas: number;
  active_chamas: number;
  total_members: number;
  active_members: number;
  total_contributions: number;
  total_loans: number;
  pending_applications: number;
  overdue_payments: number;
}

export interface FinancialOverview {
  total_assets: number;
  total_liabilities: number;
  net_worth: number;
  monthly_contributions: number;
  monthly_disbursements: number;
  pending_transactions: number;
}

// Enhanced module types
export interface ModuleComponentProps {
  chamaId: string;
  memberId: string;
  permissions: string[];
  onNavigate: (path: string) => void;
  onUpdate: (data: any) => void;
  onError: (error: string) => void;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  status: 'stable' | 'beta' | 'alpha';
  features: string[];
  permissions: string[];
  dependencies: string[];
  icon: string;
  component: React.ComponentType<ModuleComponentProps>;
}

// Form types
export interface ChamaFormData {
  name: string;
  description?: string;
  category: 'savings' | 'investment' | 'credit' | 'mixed';
  max_members: number;
  min_contribution_amount: number;
  contribution_frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'flexible';
  contribution_day?: number;
  meeting_frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'as_needed';
  location?: string;
  meeting_location?: string;
  meeting_time?: string;
  loan_interest_rate: number;
  max_loan_multiplier: number;
  penalty_rate: number;
  terms_and_conditions?: string;
}

export interface LoanApplicationData {
  purpose: string;
  amount: number;
  term_months: number;
  collateral_description?: string;
  guarantors?: Array<{
    name: string;
    id_number: string;
    phone: string;
    relationship: string;
  }>;
}

export interface ContributionData {
  amount: number;
  payment_method: 'cash' | 'bank_transfer' | 'mobile_money' | 'card';
  payment_reference?: string;
  notes?: string;
}

// Utility types
export type EntityStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type UserRole = 'admin' | 'super_admin' | 'group_admin' | 'member';
export type ChamaRole = 'leader' | 'treasurer' | 'secretary' | 'member';
export type TransactionType = 'contribution' | 'loan_disbursement' | 'loan_repayment' | 'penalty' | 'interest' | 'withdrawal' | 'fee' | 'adjustment' | 'transfer';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money' | 'card' | 'check' | 'other';
export type LoanStatus = 'pending' | 'approved' | 'disbursed' | 'active' | 'completed' | 'defaulted' | 'written_off' | 'rejected';
export type MeetingType = 'regular' | 'special' | 'annual' | 'emergency' | 'committee';
export type NotificationType = 'info' | 'warning' | 'error' | 'success' | 'reminder' | 'announcement';
