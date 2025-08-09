
-- Users table - Central user management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    national_id VARCHAR(50) UNIQUE,
    profile_picture_url TEXT,
    
    -- Account status and verification
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive', 'pending')),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected', 'expired')),
    kyc_documents JSONB,
    
    -- Security and access
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    last_login TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMP WITH TIME ZONE,
    
    -- Administrative
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'super_admin', 'group_admin', 'member')),
    permissions JSONB DEFAULT '[]'::jsonb,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Chamas/Groups table - Core group management
CREATE TABLE chamas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'savings' CHECK (category IN ('savings', 'investment', 'credit', 'mixed')),
    
    -- Group settings
    max_members INTEGER DEFAULT 50,
    min_contribution_amount DECIMAL(15,2) DEFAULT 0,
    contribution_frequency VARCHAR(20) DEFAULT 'monthly' CHECK (contribution_frequency IN ('weekly', 'monthly', 'quarterly', 'yearly', 'flexible')),
    contribution_day INTEGER, -- Day of week/month for contributions
    meeting_frequency VARCHAR(20) DEFAULT 'monthly' CHECK (meeting_frequency IN ('weekly', 'monthly', 'quarterly', 'yearly', 'as_needed')),
    
    -- Financial settings
    currency VARCHAR(10) DEFAULT 'KES',
    loan_interest_rate DECIMAL(5,2) DEFAULT 0.00,
    max_loan_multiplier DECIMAL(3,1) DEFAULT 3.0, -- Max loan as multiple of contributions
    loan_grace_period INTEGER DEFAULT 30, -- Days
    penalty_rate DECIMAL(5,2) DEFAULT 5.00,
    
    -- Group status and lifecycle
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'dissolved', 'inactive')),
    registration_number VARCHAR(100) UNIQUE,
    registration_date DATE,
    dissolution_date DATE,
    
    -- Location and meeting details
    location TEXT,
    meeting_location TEXT,
    meeting_time TIME,
    time_zone VARCHAR(50) DEFAULT 'Africa/Nairobi',
    
    -- Administrative
    admin_notes TEXT,
    terms_and_conditions TEXT,
    constitution TEXT,
    bylaws JSONB,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- ============================================================================
-- MEMBERSHIP AND ROLES
-- ============================================================================

-- Chama membership - Links users to chamas with roles
CREATE TABLE chama_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID NOT NULL REFERENCES chamas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Membership details
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('leader', 'treasurer', 'secretary', 'member')),
    member_number VARCHAR(50),
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    leave_date DATE,
    
    -- Status and permissions
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'left')),
    permissions JSONB DEFAULT '[]'::jsonb,
    voting_rights BOOLEAN DEFAULT TRUE,
    
    -- Financial tracking
    total_contributions DECIMAL(15,2) DEFAULT 0.00,
    current_balance DECIMAL(15,2) DEFAULT 0.00,
    outstanding_loans DECIMAL(15,2) DEFAULT 0.00,
    penalty_balance DECIMAL(15,2) DEFAULT 0.00,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    UNIQUE(chama_id, user_id)
);

-- ============================================================================
-- FINANCIAL TRANSACTIONS
-- ============================================================================

-- Core transactions table - All financial movements
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID NOT NULL REFERENCES chamas(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES users(id),
    
    -- Transaction identification
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('contribution', 'loan_disbursement', 'loan_repayment', 'penalty', 'interest', 'withdrawal', 'fee', 'adjustment', 'transfer')),
    transaction_number VARCHAR(100) UNIQUE,
    reference_number VARCHAR(100), -- External reference (bank, mobile money, etc.)
    
    -- Financial details
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'KES',
    fee_amount DECIMAL(15,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2) GENERATED ALWAYS AS (amount - fee_amount) STORED,
    
    -- Payment details
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'bank_transfer', 'mobile_money', 'card', 'check', 'other')),
    payment_reference VARCHAR(255),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Transaction status and processing
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'cancelled', 'reversed')),
    confirmation_code VARCHAR(100),
    failure_reason TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id),
    
    -- Categorization and tracking
    category VARCHAR(100),
    description TEXT,
    notes TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    
    -- Related entities
    related_loan_id UUID,
    related_meeting_id UUID,
    related_transaction_id UUID REFERENCES transactions(id), -- For reversals, adjustments
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Contributions table - Detailed contribution tracking
CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID NOT NULL REFERENCES chamas(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES users(id),
    transaction_id UUID REFERENCES transactions(id),
    
    -- Contribution details
    contribution_type VARCHAR(50) DEFAULT 'regular' CHECK (contribution_type IN ('regular', 'voluntary', 'penalty', 'special', 'catch_up')),
    period_year INTEGER NOT NULL,
    period_month INTEGER, -- For monthly contributions
    period_week INTEGER, -- For weekly contributions
    
    -- Financial details
    expected_amount DECIMAL(15,2) NOT NULL,
    actual_amount DECIMAL(15,2) NOT NULL,
    variance DECIMAL(15,2) GENERATED ALWAYS AS (actual_amount - expected_amount) STORED,
    
    -- Timing
    due_date DATE NOT NULL,
    paid_date DATE,
    days_late INTEGER GENERATED ALWAYS AS (CASE WHEN paid_date IS NOT NULL THEN GREATEST(0, paid_date - due_date) ELSE NULL END) STORED,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'completed', 'overdue', 'waived')),
    
    -- Additional details
    notes TEXT,
    waiver_reason TEXT,
    waived_by UUID REFERENCES users(id),
    waived_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- ============================================================================
-- LOANS AND CREDIT
-- ============================================================================

-- Loans table - Loan management
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID NOT NULL REFERENCES chamas(id) ON DELETE CASCADE,
    borrower_id UUID NOT NULL REFERENCES users(id),
    
    -- Loan identification
    loan_number VARCHAR(100) UNIQUE NOT NULL,
    loan_type VARCHAR(50) DEFAULT 'personal' CHECK (loan_type IN ('personal', 'business', 'emergency', 'development', 'other')),
    
    -- Financial terms
    principal_amount DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    interest_type VARCHAR(20) DEFAULT 'simple' CHECK (interest_type IN ('simple', 'compound', 'reducing_balance')),
    term_months INTEGER NOT NULL,
    monthly_payment DECIMAL(15,2),
    total_interest DECIMAL(15,2),
    total_amount DECIMAL(15,2) GENERATED ALWAYS AS (principal_amount + COALESCE(total_interest, 0)) STORED,
    
    -- Repayment schedule
    first_payment_date DATE NOT NULL,
    final_payment_date DATE NOT NULL,
    payment_frequency VARCHAR(20) DEFAULT 'monthly' CHECK (payment_frequency IN ('weekly', 'monthly', 'quarterly')),
    grace_period_days INTEGER DEFAULT 0,
    
    -- Current status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'disbursed', 'active', 'completed', 'defaulted', 'written_off', 'rejected')),
    disbursed_amount DECIMAL(15,2) DEFAULT 0.00,
    repaid_amount DECIMAL(15,2) DEFAULT 0.00,
    outstanding_balance DECIMAL(15,2),
    penalty_amount DECIMAL(15,2) DEFAULT 0.00,
    
    -- Application and approval
    application_date DATE DEFAULT CURRENT_DATE,
    purpose TEXT NOT NULL,
    collateral_description TEXT,
    guarantors JSONB DEFAULT '[]'::jsonb,
    
    -- Approval workflow
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,
    rejection_reason TEXT,
    
    -- Disbursement
    disbursed_by UUID REFERENCES users(id),
    disbursed_at TIMESTAMP WITH TIME ZONE,
    disbursement_method VARCHAR(50),
    disbursement_reference VARCHAR(255),
    
    -- Default and recovery
    default_date DATE,
    recovery_actions JSONB DEFAULT '[]'::jsonb,
    writeoff_date DATE,
    writeoff_amount DECIMAL(15,2),
    writeoff_reason TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Loan repayments table - Track individual loan payments
CREATE TABLE loan_repayments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id),
    
    -- Payment details
    payment_number INTEGER NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    
    -- Amount breakdown
    scheduled_amount DECIMAL(15,2) NOT NULL,
    principal_amount DECIMAL(15,2) NOT NULL,
    interest_amount DECIMAL(15,2) NOT NULL,
    penalty_amount DECIMAL(15,2) DEFAULT 0.00,
    total_due DECIMAL(15,2) GENERATED ALWAYS AS (principal_amount + interest_amount + penalty_amount) STORED,
    
    -- Actual payment
    amount_paid DECIMAL(15,2) DEFAULT 0.00,
    principal_paid DECIMAL(15,2) DEFAULT 0.00,
    interest_paid DECIMAL(15,2) DEFAULT 0.00,
    penalty_paid DECIMAL(15,2) DEFAULT 0.00,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'completed', 'overdue', 'waived')),
    days_overdue INTEGER DEFAULT 0,
    
    -- Additional details
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    notes TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- MEETINGS AND GOVERNANCE
-- ============================================================================

-- Meetings table - Meeting management
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID NOT NULL REFERENCES chamas(id) ON DELETE CASCADE,
    
    -- Meeting details
    title VARCHAR(255) NOT NULL,
    meeting_type VARCHAR(50) DEFAULT 'regular' CHECK (meeting_type IN ('regular', 'special', 'annual', 'emergency', 'committee')),
    description TEXT,
    agenda JSONB DEFAULT '[]'::jsonb,
    
    -- Scheduling
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    duration_minutes INTEGER,
    time_zone VARCHAR(50) DEFAULT 'Africa/Nairobi',
    
    -- Location
    location TEXT,
    location_type VARCHAR(20) DEFAULT 'physical' CHECK (location_type IN ('physical', 'virtual', 'hybrid')),
    meeting_link TEXT, -- For virtual meetings
    
    -- Status and outcomes
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed')),
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    
    -- Participation
    expected_attendees INTEGER,
    actual_attendees INTEGER,
    quorum_met BOOLEAN,
    quorum_percentage DECIMAL(5,2),
    
    -- Documentation
    minutes TEXT,
    resolutions JSONB DEFAULT '[]'::jsonb,
    action_items JSONB DEFAULT '[]'::jsonb,
    attachments JSONB DEFAULT '[]'::jsonb,
    
    -- Administrative
    chairperson_id UUID REFERENCES users(id),
    secretary_id UUID REFERENCES users(id),
    notes TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Meeting attendance tracking
CREATE TABLE meeting_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES users(id),
    
    -- Attendance details
    status VARCHAR(20) DEFAULT 'expected' CHECK (status IN ('expected', 'present', 'absent', 'excused', 'late')),
    arrival_time TIMESTAMP WITH TIME ZONE,
    departure_time TIMESTAMP WITH TIME ZONE,
    
    -- Participation
    contributed_to_discussions BOOLEAN DEFAULT FALSE,
    voted_on_resolutions BOOLEAN DEFAULT FALSE,
    
    -- Additional details
    excuse_reason TEXT,
    notes TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(meeting_id, member_id)
);

-- ============================================================================
-- ENHANCED FEATURES FOR DJANGO INTEGRATION
-- ============================================================================

-- Django sessions (if using database sessions)
CREATE TABLE django_session (
    session_key VARCHAR(40) PRIMARY KEY,
    session_data TEXT NOT NULL,
    expire_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- API tokens for frontend-backend communication
CREATE TABLE api_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Token details
    token_key VARCHAR(64) UNIQUE NOT NULL, -- First 8 chars for identification
    token_hash VARCHAR(128) NOT NULL, -- Full token hash
    name VARCHAR(255) NOT NULL, -- Token name/description
    
    -- Permissions and scope
    permissions JSONB DEFAULT '[]'::jsonb,
    scopes JSONB DEFAULT '["read"]'::jsonb, -- read, write, admin
    
    -- Usage tracking
    last_used TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    
    -- Security
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Client information
    client_ip INET,
    user_agent TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- File uploads and document management
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID REFERENCES chamas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- File details
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64), -- For duplicate detection
    
    -- Categorization
    file_type VARCHAR(50) CHECK (file_type IN ('profile_picture', 'kyc_document', 'meeting_minutes', 'financial_report', 'contract', 'receipt', 'other')),
    category VARCHAR(100),
    description TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    
    -- Access control
    is_public BOOLEAN DEFAULT FALSE,
    access_permissions JSONB DEFAULT '{}'::jsonb,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Status
    status VARCHAR(20) DEFAULT 'uploaded' CHECK (status IN ('uploading', 'uploaded', 'processing', 'ready', 'error', 'deleted')),
    virus_scan_status VARCHAR(20) DEFAULT 'pending' CHECK (virus_scan_status IN ('pending', 'clean', 'infected', 'error')),
    
    -- Related entities
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Mobile money integration tracking
CREATE TABLE mobile_money_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    
    -- Provider details
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('mpesa', 'airtel_money', 'tkash', 'equitel', 'other')),
    provider_transaction_id VARCHAR(255) UNIQUE,
    
    -- Transaction details
    phone_number VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'KES',
    
    -- API integration
    request_payload JSONB,
    response_payload JSONB,
    callback_payload JSONB,
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'initiated' CHECK (status IN ('initiated', 'pending', 'completed', 'failed', 'timeout', 'cancelled')),
    provider_status VARCHAR(50),
    error_code VARCHAR(50),
    error_message TEXT,
    
    -- Timing
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Reconciliation
    reconciled BOOLEAN DEFAULT FALSE,
    reconciled_at TIMESTAMP WITH TIME ZONE,
    reconciled_by UUID REFERENCES users(id),
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email templates and communication history
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID REFERENCES chamas(id) ON DELETE CASCADE, -- NULL for global templates
    
    -- Template details
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_type VARCHAR(50) CHECK (template_type IN ('welcome', 'contribution_reminder', 'meeting_reminder', 'loan_approval', 'loan_reminder', 'penalty_notice', 'newsletter', 'custom')),
    
    -- Content
    html_content TEXT NOT NULL,
    text_content TEXT,
    
    -- Template variables
    variables JSONB DEFAULT '[]'::jsonb, -- Available variables for substitution
    
    -- Settings
    is_active BOOLEAN DEFAULT TRUE,
    is_system BOOLEAN DEFAULT FALSE, -- System templates cannot be deleted
    
    -- Usage tracking
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- SMS templates
CREATE TABLE sms_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID REFERENCES chamas(id) ON DELETE CASCADE,
    
    -- Template details
    name VARCHAR(255) NOT NULL,
    template_type VARCHAR(50) CHECK (template_type IN ('welcome', 'contribution_reminder', 'meeting_reminder', 'loan_approval', 'loan_reminder', 'penalty_notice', 'otp', 'custom')),
    
    -- Content (SMS character limits)
    content TEXT NOT NULL CHECK (LENGTH(content) <= 320),
    
    -- Template variables
    variables JSONB DEFAULT '[]'::jsonb,
    
    -- Settings
    is_active BOOLEAN DEFAULT TRUE,
    is_system BOOLEAN DEFAULT FALSE,
    
    -- Usage tracking
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Communication history (emails, SMS sent)
CREATE TABLE communication_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID REFERENCES chamas(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id),
    
    -- Communication details
    communication_type VARCHAR(20) CHECK (communication_type IN ('email', 'sms', 'push', 'in_app')),
    template_id UUID, -- References email_templates or sms_templates
    
    -- Content
    subject VARCHAR(255),
    content TEXT NOT NULL,
    
    -- Delivery details
    recipient_address VARCHAR(255), -- email or phone number
    provider VARCHAR(50), -- email service, SMS provider, etc.
    provider_message_id VARCHAR(255),
    
    -- Status
    status VARCHAR(20) DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'bounced', 'failed', 'opened', 'clicked')),
    error_message TEXT,
    
    -- Timing
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    
    -- Context
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    campaign_id UUID,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- ============================================================================
-- DJANGO-SPECIFIC ENHANCEMENTS
-- ============================================================================

-- Performance metrics tracking
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID REFERENCES chamas(id) ON DELETE CASCADE,
    
    -- Metric details
    metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN ('contribution_rate', 'loan_repayment_rate', 'meeting_attendance', 'member_retention', 'growth_rate', 'roi', 'liquidity_ratio')),
    metric_name VARCHAR(255) NOT NULL,
    
    -- Values
    metric_value DECIMAL(15,4) NOT NULL,
    target_value DECIMAL(15,4),
    previous_value DECIMAL(15,4),
    
    -- Time period
    period_type VARCHAR(20) CHECK (period_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Metadata
    calculation_method TEXT,
    data_sources JSONB DEFAULT '[]'::jsonb,
    confidence_level DECIMAL(5,2) DEFAULT 100.00,
    
    -- Status
    is_calculated BOOLEAN DEFAULT TRUE,
    is_estimated BOOLEAN DEFAULT FALSE,
    
    -- Audit fields
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    calculated_by UUID REFERENCES users(id),
    
    UNIQUE(chama_id, metric_type, period_start, period_end)
);

-- Risk assessment and scoring
CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID REFERENCES chamas(id) ON DELETE CASCADE,
    member_id UUID REFERENCES users(id), -- NULL for chama-level risk
    
    -- Risk details
    assessment_type VARCHAR(50) CHECK (assessment_type IN ('credit_risk', 'operational_risk', 'liquidity_risk', 'market_risk', 'compliance_risk')),
    risk_score DECIMAL(5,2) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level VARCHAR(20) CHECK (risk_level IN ('very_low', 'low', 'medium', 'high', 'very_high')),
    
    -- Factors
    risk_factors JSONB DEFAULT '[]'::jsonb,
    mitigation_strategies JSONB DEFAULT '[]'::jsonb,
    
    -- Assessment details
    assessment_method VARCHAR(100),
    assessor_type VARCHAR(50) CHECK (assessor_type IN ('automated', 'manual', 'hybrid')),
    model_version VARCHAR(50),
    
    -- Validity
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Review
    review_required BOOLEAN DEFAULT FALSE,
    next_review_date DATE,
    
    -- Audit fields
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assessed_by UUID REFERENCES users(id),
    
    -- Notes
    notes TEXT,
    recommendations TEXT
);

-- Compliance tracking
CREATE TABLE compliance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID NOT NULL REFERENCES chamas(id) ON DELETE CASCADE,
    
    -- Compliance details
    compliance_type VARCHAR(50) CHECK (compliance_type IN ('regulatory', 'internal_policy', 'legal', 'tax', 'reporting')),
    requirement_name VARCHAR(255) NOT NULL,
    requirement_description TEXT,
    
    -- Status
    compliance_status VARCHAR(20) DEFAULT 'pending' CHECK (compliance_status IN ('compliant', 'non_compliant', 'pending', 'partial', 'not_applicable')),
    
    -- Due dates and timelines
    due_date DATE,
    completion_date DATE,
    next_review_date DATE,
    
    -- Evidence and documentation
    evidence_documents JSONB DEFAULT '[]'::jsonb,
    compliance_notes TEXT,
    
    -- Responsible parties
    responsible_member_id UUID REFERENCES users(id),
    reviewer_id UUID REFERENCES users(id),
    
    -- Penalties and consequences
    penalty_amount DECIMAL(15,2) DEFAULT 0.00,
    penalty_description TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Enhanced dashboard widgets configuration
CREATE TABLE dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID REFERENCES chamas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Widget details
    widget_type VARCHAR(50) NOT NULL CHECK (widget_type IN ('chart', 'metric', 'table', 'calendar', 'notification', 'quick_action')),
    widget_name VARCHAR(255) NOT NULL,
    widget_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Layout
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    width INTEGER DEFAULT 1,
    height INTEGER DEFAULT 1,
    
    -- Visibility
    is_visible BOOLEAN DEFAULT TRUE,
    is_draggable BOOLEAN DEFAULT TRUE,
    is_resizable BOOLEAN DEFAULT TRUE,
    
    -- Data source
    data_source VARCHAR(100),
    refresh_interval INTEGER DEFAULT 300, -- seconds
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    
    UNIQUE(chama_id, user_id, widget_name)
);

-- ============================================================================
-- ENHANCED FEATURES (ORIGINAL CONTENT PRESERVED)
-- ============================================================================

-- Goals and targets - Enhanced goal tracking
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID NOT NULL REFERENCES chamas(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),
    
    -- Goal details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_type VARCHAR(50) CHECK (goal_type IN ('savings', 'investment', 'loan_disbursement', 'membership', 'project', 'other')),
    category VARCHAR(100),
    
    -- Targets
    target_amount DECIMAL(15,2),
    current_amount DECIMAL(15,2) DEFAULT 0.00,
    target_date DATE,
    
    -- Progress tracking
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled', 'overdue')),
    progress_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN target_amount > 0 THEN LEAST(100, (current_amount / target_amount) * 100)
            ELSE 0 
        END
    ) STORED,
    
    -- Milestones
    milestones JSONB DEFAULT '[]'::jsonb,
    completed_milestones JSONB DEFAULT '[]'::jsonb,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- Investment tracking - Enhanced investment management
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID NOT NULL REFERENCES chamas(id) ON DELETE CASCADE,
    
    -- Investment details
    name VARCHAR(255) NOT NULL,
    investment_type VARCHAR(50) CHECK (investment_type IN ('stocks', 'bonds', 'real_estate', 'mutual_funds', 'fixed_deposit', 'business', 'other')),
    description TEXT,
    
    -- Financial details
    initial_investment DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2),
    total_invested DECIMAL(15,2) DEFAULT 0.00,
    total_returns DECIMAL(15,2) DEFAULT 0.00,
    unrealized_gains DECIMAL(15,2) DEFAULT 0.00,
    realized_gains DECIMAL(15,2) DEFAULT 0.00,
    
    -- Performance metrics
    roi_percentage DECIMAL(8,4) GENERATED ALWAYS AS (
        CASE 
            WHEN initial_investment > 0 THEN ((COALESCE(current_value, 0) - initial_investment) / initial_investment) * 100
            ELSE 0 
        END
    ) STORED,
    
    -- Investment lifecycle
    purchase_date DATE NOT NULL,
    maturity_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'matured', 'defaulted', 'suspended')),
    
    -- External tracking
    broker_name VARCHAR(255),
    account_number VARCHAR(100),
    certificate_number VARCHAR(100),
    
    -- Risk and compliance
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'very_high')),
    compliance_status VARCHAR(20) DEFAULT 'compliant',
    
    -- Documentation
    documents JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Communication and notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID REFERENCES chamas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) CHECK (notification_type IN ('info', 'warning', 'error', 'success', 'reminder', 'announcement')),
    category VARCHAR(100),
    
    -- Delivery
    channels JSONB DEFAULT '["app"]'::jsonb, -- app, email, sms, push
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Context
    related_entity_type VARCHAR(50), -- loan, contribution, meeting, etc.
    related_entity_id UUID,
    action_url TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- ============================================================================
-- REPORTING AND ANALYTICS
-- ============================================================================

-- Reports table - Generated reports tracking
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID REFERENCES chamas(id) ON DELETE CASCADE,
    
    -- Report details
    name VARCHAR(255) NOT NULL,
    report_type VARCHAR(50) CHECK (report_type IN ('financial', 'membership', 'attendance', 'loans', 'investments', 'custom', 'regulatory')),
    description TEXT,
    
    -- Parameters
    parameters JSONB DEFAULT '{}'::jsonb,
    date_from DATE,
    date_to DATE,
    
    -- Generation
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
    file_path TEXT,
    file_format VARCHAR(10) CHECK (file_format IN ('pdf', 'excel', 'csv', 'json')),
    file_size INTEGER,
    
    -- Access and sharing
    is_public BOOLEAN DEFAULT FALSE,
    shared_with JSONB DEFAULT '[]'::jsonb,
    download_count INTEGER DEFAULT 0,
    
    -- Audit fields
    generated_by UUID NOT NULL REFERENCES users(id),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- SYSTEM ADMINISTRATION
-- ============================================================================

-- System settings and configuration
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID REFERENCES chamas(id) ON DELETE CASCADE, -- NULL for global settings
    
    -- Setting details
    setting_key VARCHAR(255) NOT NULL,
    setting_value JSONB NOT NULL,
    setting_type VARCHAR(50) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'object', 'array')),
    
    -- Metadata
    category VARCHAR(100),
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    is_system BOOLEAN DEFAULT FALSE, -- Cannot be modified by users
    
    -- Validation
    validation_rules JSONB DEFAULT '{}'::jsonb,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    
    UNIQUE(chama_id, setting_key)
);

-- Audit trail for important operations
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chama_id UUID REFERENCES chamas(id) ON DELETE CASCADE,
    
    -- Event details
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- user, chama, loan, transaction, etc.
    entity_id UUID NOT NULL,
    
    -- Changes
    action VARCHAR(50) NOT NULL CHECK (action IN ('create', 'update', 'delete', 'approve', 'reject', 'suspend', 'activate')),
    old_values JSONB,
    new_values JSONB,
    changed_fields JSONB DEFAULT '[]'::jsonb,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    request_id VARCHAR(255),
    
    -- Administrative
    notes TEXT,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    
    -- Audit fields
    performed_by UUID REFERENCES users(id),
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);

-- Chamas indexes
CREATE INDEX idx_chamas_status ON chamas(status);
CREATE INDEX idx_chamas_category ON chamas(category);
CREATE INDEX idx_chamas_created_at ON chamas(created_at);

-- Chama members indexes
CREATE INDEX idx_chama_members_chama_id ON chama_members(chama_id);
CREATE INDEX idx_chama_members_user_id ON chama_members(user_id);
CREATE INDEX idx_chama_members_status ON chama_members(status);
CREATE INDEX idx_chama_members_role ON chama_members(role);

-- Transactions indexes
CREATE INDEX idx_transactions_chama_id ON transactions(chama_id);
CREATE INDEX idx_transactions_member_id ON transactions(member_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_payment_date ON transactions(payment_date);
CREATE INDEX idx_transactions_amount ON transactions(amount);

-- Contributions indexes
CREATE INDEX idx_contributions_chama_id ON contributions(chama_id);
CREATE INDEX idx_contributions_member_id ON contributions(member_id);
CREATE INDEX idx_contributions_period ON contributions(period_year, period_month);
CREATE INDEX idx_contributions_status ON contributions(status);
CREATE INDEX idx_contributions_due_date ON contributions(due_date);

-- Loans indexes
CREATE INDEX idx_loans_chama_id ON loans(chama_id);
CREATE INDEX idx_loans_borrower_id ON loans(borrower_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_application_date ON loans(application_date);
CREATE INDEX idx_loans_outstanding_balance ON loans(outstanding_balance);

-- Meetings indexes
CREATE INDEX idx_meetings_chama_id ON meetings(chama_id);
CREATE INDEX idx_meetings_scheduled_date ON meetings(scheduled_date);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_type ON meetings(meeting_type);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_chama_id ON notifications(chama_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_chama_id ON audit_logs(chama_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_performed_by ON audit_logs(performed_by);
CREATE INDEX idx_audit_logs_performed_at ON audit_logs(performed_at);

-- ============================================================================
-- ADDITIONAL INDEXES FOR NEW TABLES
-- ============================================================================

-- API tokens indexes
CREATE INDEX idx_api_tokens_user_id ON api_tokens(user_id);
CREATE INDEX idx_api_tokens_token_key ON api_tokens(token_key);
CREATE INDEX idx_api_tokens_is_active ON api_tokens(is_active);
CREATE INDEX idx_api_tokens_expires_at ON api_tokens(expires_at);

-- File uploads indexes
CREATE INDEX idx_file_uploads_chama_id ON file_uploads(chama_id);
CREATE INDEX idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX idx_file_uploads_file_type ON file_uploads(file_type);
CREATE INDEX idx_file_uploads_status ON file_uploads(status);
CREATE INDEX idx_file_uploads_related_entity ON file_uploads(related_entity_type, related_entity_id);

-- Mobile money transactions indexes
CREATE INDEX idx_mobile_money_transaction_id ON mobile_money_transactions(transaction_id);
CREATE INDEX idx_mobile_money_provider ON mobile_money_transactions(provider);
CREATE INDEX idx_mobile_money_status ON mobile_money_transactions(status);
CREATE INDEX idx_mobile_money_phone ON mobile_money_transactions(phone_number);
CREATE INDEX idx_mobile_money_provider_tx_id ON mobile_money_transactions(provider_transaction_id);

-- Communication history indexes
CREATE INDEX idx_communication_history_chama_id ON communication_history(chama_id);
CREATE INDEX idx_communication_history_recipient_id ON communication_history(recipient_id);
CREATE INDEX idx_communication_history_type ON communication_history(communication_type);
CREATE INDEX idx_communication_history_status ON communication_history(status);
CREATE INDEX idx_communication_history_sent_at ON communication_history(sent_at);

-- Performance metrics indexes
CREATE INDEX idx_performance_metrics_chama_id ON performance_metrics(chama_id);
CREATE INDEX idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX idx_performance_metrics_period ON performance_metrics(period_start, period_end);

-- Risk assessments indexes
CREATE INDEX idx_risk_assessments_chama_id ON risk_assessments(chama_id);
CREATE INDEX idx_risk_assessments_member_id ON risk_assessments(member_id);
CREATE INDEX idx_risk_assessments_type ON risk_assessments(assessment_type);
CREATE INDEX idx_risk_assessments_score ON risk_assessments(risk_score);
CREATE INDEX idx_risk_assessments_active ON risk_assessments(is_active);

-- Compliance records indexes
CREATE INDEX idx_compliance_records_chama_id ON compliance_records(chama_id);
CREATE INDEX idx_compliance_records_type ON compliance_records(compliance_type);
CREATE INDEX idx_compliance_records_status ON compliance_records(compliance_status);
CREATE INDEX idx_compliance_records_due_date ON compliance_records(due_date);

-- Dashboard widgets indexes
CREATE INDEX idx_dashboard_widgets_chama_id ON dashboard_widgets(chama_id);
CREATE INDEX idx_dashboard_widgets_user_id ON dashboard_widgets(user_id);
CREATE INDEX idx_dashboard_widgets_type ON dashboard_widgets(widget_type);
CREATE INDEX idx_dashboard_widgets_visible ON dashboard_widgets(is_visible);

-- ============================================================================
-- TRIGGERS FOR AUTOMATED FUNCTIONALITY
-- ============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chamas_updated_at BEFORE UPDATE ON chamas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chama_members_updated_at BEFORE UPDATE ON chama_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contributions_updated_at BEFORE UPDATE ON contributions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add triggers for new tables
CREATE TRIGGER update_api_tokens_updated_at BEFORE UPDATE ON api_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_file_uploads_updated_at BEFORE UPDATE ON file_uploads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mobile_money_transactions_updated_at BEFORE UPDATE ON mobile_money_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sms_templates_updated_at BEFORE UPDATE ON sms_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_communication_history_updated_at BEFORE UPDATE ON communication_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_records_updated_at BEFORE UPDATE ON compliance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dashboard_widgets_updated_at BEFORE UPDATE ON dashboard_widgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Chama summary view
CREATE VIEW chama_summary AS
SELECT 
    c.id,
    c.name,
    c.category,
    c.status,
    c.created_at,
    COUNT(cm.id) as total_members,
    COUNT(CASE WHEN cm.status = 'active' THEN 1 END) as active_members,
    COALESCE(SUM(cm.total_contributions), 0) as total_contributions,
    COALESCE(SUM(cm.outstanding_loans), 0) as total_outstanding_loans,
    COALESCE(SUM(cm.current_balance), 0) as total_balances
FROM chamas c
LEFT JOIN chama_members cm ON c.id = cm.chama_id
GROUP BY c.id, c.name, c.category, c.status, c.created_at;

-- Member financial summary view
CREATE VIEW member_financial_summary AS
SELECT 
    cm.chama_id,
    cm.user_id,
    u.first_name,
    u.last_name,
    u.email,
    cm.role,
    cm.status,
    cm.join_date,
    cm.total_contributions,
    cm.current_balance,
    cm.outstanding_loans,
    COUNT(DISTINCT l.id) as total_loans,
    COUNT(CASE WHEN l.status = 'active' THEN 1 END) as active_loans,
    COALESCE(SUM(CASE WHEN l.status = 'active' THEN l.outstanding_balance END), 0) as active_loan_balance
FROM chama_members cm
JOIN users u ON cm.user_id = u.id
LEFT JOIN loans l ON cm.user_id = l.borrower_id AND cm.chama_id = l.chama_id
GROUP BY cm.chama_id, cm.user_id, u.first_name, u.last_name, u.email, 
         cm.role, cm.status, cm.join_date, cm.total_contributions, 
         cm.current_balance, cm.outstanding_loans;

-- Recent transactions view
CREATE VIEW recent_transactions AS
SELECT 
    t.id,
    t.chama_id,
    c.name as chama_name,
    t.member_id,
    CONCAT(u.first_name, ' ', u.last_name) as member_name,
    t.transaction_type,
    t.amount,
    t.currency,
    t.payment_method,
    t.status,
    t.description,
    t.payment_date,
    t.created_at
FROM transactions t
JOIN chamas c ON t.chama_id = c.id
JOIN users u ON t.member_id = u.id
ORDER BY t.payment_date DESC, t.created_at DESC;

-- ============================================================================
-- SAMPLE DATA (Optional - for development/testing)
-- ============================================================================

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description, is_system) VALUES
('app_name', '"MoneyPool"', 'string', 'general', 'Application name', true),
('default_currency', '"KES"', 'string', 'financial', 'Default currency code', true),
('max_login_attempts', '5', 'number', 'security', 'Maximum failed login attempts before account lock', true),
('account_lock_duration_minutes', '30', 'number', 'security', 'Duration to lock account after max failed attempts', true),
('default_loan_interest_rate', '5.0', 'number', 'financial', 'Default annual interest rate for loans', false),
('contribution_reminder_days', '3', 'number', 'notifications', 'Days before due date to send contribution reminders', false),
('meeting_reminder_hours', '24', 'number', 'notifications', 'Hours before meeting to send reminders', false),
('enable_email_notifications', 'true', 'boolean', 'notifications', 'Enable email notifications', false),
('enable_sms_notifications', 'true', 'boolean', 'notifications', 'Enable SMS notifications', false),
('timezone', '"Africa/Nairobi"', 'string', 'general', 'Default timezone', false),
('file_upload_max_size_mb', '10', 'number', 'uploads', 'Maximum file upload size in MB', false),
('allowed_file_types', '["pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png", "gif"]', 'array', 'uploads', 'Allowed file upload types', false),
('mobile_money_providers', '["mpesa", "airtel_money", "tkash", "equitel"]', 'array', 'payments', 'Supported mobile money providers', false),
('api_rate_limit_per_minute', '60', 'number', 'api', 'API rate limit per minute per user', true),
('session_timeout_minutes', '30', 'number', 'security', 'Session timeout in minutes', false);

-- Insert default email templates
INSERT INTO email_templates (name, subject, template_type, html_content, text_content, is_system, variables) VALUES
('Welcome Email', 'Welcome to {{chama_name}}!', 'welcome', 
'<h1>Welcome to {{chama_name}}!</h1><p>Dear {{member_name}},</p><p>We are excited to have you join our chama. Your journey towards financial empowerment starts here!</p><p>Best regards,<br>{{chama_name}} Team</p>',
'Welcome to {{chama_name}}! Dear {{member_name}}, We are excited to have you join our chama. Your journey towards financial empowerment starts here! Best regards, {{chama_name}} Team',
true, '["chama_name", "member_name"]'::jsonb),

('Contribution Reminder', 'Contribution Due - {{chama_name}}', 'contribution_reminder',
'<h2>Contribution Reminder</h2><p>Dear {{member_name}},</p><p>This is a friendly reminder that your contribution of <strong>KES {{amount}}</strong> is due on <strong>{{due_date}}</strong>.</p><p>Please ensure timely payment to avoid penalties.</p><p>Best regards,<br>{{chama_name}} Treasurer</p>',
'Contribution Reminder: Dear {{member_name}}, Your contribution of KES {{amount}} is due on {{due_date}}. Please ensure timely payment. Best regards, {{chama_name}} Treasurer',
true, '["chama_name", "member_name", "amount", "due_date"]'::jsonb),

('Meeting Reminder', 'Upcoming Meeting - {{chama_name}}', 'meeting_reminder',
'<h2>Meeting Reminder</h2><p>Dear {{member_name}},</p><p>This is to remind you about our upcoming meeting:</p><ul><li><strong>Date:</strong> {{meeting_date}}</li><li><strong>Time:</strong> {{meeting_time}}</li><li><strong>Location:</strong> {{meeting_location}}</li></ul><p>Please confirm your attendance.</p><p>Best regards,<br>{{chama_name}} Secretary</p>',
'Meeting Reminder: Dear {{member_name}}, Upcoming meeting on {{meeting_date}} at {{meeting_time}}, {{meeting_location}}. Please confirm attendance. Best regards, {{chama_name}} Secretary',
true, '["chama_name", "member_name", "meeting_date", "meeting_time", "meeting_location"]'::jsonb);

-- Insert default SMS templates
INSERT INTO sms_templates (name, template_type, content, is_system, variables) VALUES
('Welcome SMS', 'welcome', 'Welcome to {{chama_name}}! Your membership is now active. Visit our platform to get started.', true, '["chama_name"]'::jsonb),
('Contribution Reminder SMS', 'contribution_reminder', 'Hi {{member_name}}, your contribution of KES {{amount}} is due {{due_date}}. Pay via mobile money or bank transfer.', true, '["member_name", "amount", "due_date"]'::jsonb),
('Meeting Reminder SMS', 'meeting_reminder', '{{chama_name}} meeting on {{meeting_date}} at {{meeting_time}}, {{meeting_location}}. Please attend.', true, '["chama_name", "meeting_date", "meeting_time", "meeting_location"]'::jsonb),
('Loan Approval SMS', 'loan_approval', 'Congratulations! Your loan of KES {{amount}} has been approved. First payment due {{due_date}}.', true, '["amount", "due_date"]'::jsonb),
('OTP SMS', 'otp', 'Your MoneyPool verification code is: {{otp_code}}. Valid for 10 minutes. Do not share this code.', true, '["otp_code"]'::jsonb);

-- Create a sample admin user (password: 'admin123' - hashed)
INSERT INTO users (
    email, 
    password_hash, 
    first_name, 
    last_name, 
    role, 
    status, 
    email_verified, 
    phone_verified,
    permissions
) VALUES (
    'admin@moneypool.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFNKNiLkUcjt1cq', -- bcrypt hash of 'admin123'
    'System',
    'Administrator',
    'super_admin',
    'active',
    true,
    true,
    '["admin_access", "user_management", "chama_management", "financial_management", "system_administration", "api_access"]'::jsonb
);

-- ============================================================================
-- SECURITY POLICIES (Row Level Security)
-- ============================================================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chamas ENABLE ROW LEVEL SECURITY;
ALTER TABLE chama_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (customize based on your security requirements)

-- Users can see their own data and admins can see all
CREATE POLICY users_access_policy ON users
    FOR ALL
    USING (
        id = current_setting('app.current_user_id')::UUID 
        OR current_setting('app.current_user_role') IN ('admin', 'super_admin')
    );

-- Members can see data from their chamas, admins can see all
CREATE POLICY chama_members_access_policy ON chama_members
    FOR ALL
    USING (
        user_id = current_setting('app.current_user_id')::UUID
        OR chama_id IN (
            SELECT chama_id FROM chama_members 
            WHERE user_id = current_setting('app.current_user_id')::UUID
        )
        OR current_setting('app.current_user_role') IN ('admin', 'super_admin')
    );

-- Similar patterns for other tables...

-- ============================================================================
-- DJANGO INTEGRATION FUNCTIONS
-- ============================================================================

-- Function to generate API tokens
CREATE OR REPLACE FUNCTION generate_api_token(user_uuid UUID, token_name VARCHAR(255), token_scopes JSONB DEFAULT '["read"]'::jsonb)
RETURNS TEXT AS $$
DECLARE
    token_key VARCHAR(64);
    token_hash VARCHAR(128);
    full_token TEXT;
BEGIN
    -- Generate a random token
    full_token := encode(gen_random_bytes(32), 'hex');
    token_key := substring(full_token, 1, 8);
    token_hash := encode(digest(full_token, 'sha256'), 'hex');
    
    -- Insert the token
    INSERT INTO api_tokens (user_id, token_key, token_hash, name, scopes)
    VALUES (user_uuid, token_key, token_hash, token_name, token_scopes);
    
    RETURN full_token;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate chama performance metrics
CREATE OR REPLACE FUNCTION calculate_chama_metrics(chama_uuid UUID, metric_period_start DATE, metric_period_end DATE)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    contribution_rate DECIMAL(5,2);
    loan_repayment_rate DECIMAL(5,2);
    meeting_attendance_rate DECIMAL(5,2);
    member_retention_rate DECIMAL(5,2);
BEGIN
    -- Calculate contribution rate
    SELECT 
        CASE 
            WHEN COUNT(*) > 0 THEN 
                (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*))
            ELSE 0 
        END INTO contribution_rate
    FROM contributions 
    WHERE chama_id = chama_uuid 
    AND due_date BETWEEN metric_period_start AND metric_period_end;
    
    -- Calculate loan repayment rate
    SELECT 
        CASE 
            WHEN COUNT(*) > 0 THEN 
                (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*))
            ELSE 0 
        END INTO loan_repayment_rate
    FROM loan_repayments lr
    JOIN loans l ON lr.loan_id = l.id
    WHERE l.chama_id = chama_uuid 
    AND lr.due_date BETWEEN metric_period_start AND metric_period_end;
    
    -- Calculate meeting attendance rate
    SELECT 
        CASE 
            WHEN COUNT(*) > 0 THEN 
                (COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0 / COUNT(*))
            ELSE 0 
        END INTO meeting_attendance_rate
    FROM meeting_attendance ma
    JOIN meetings m ON ma.meeting_id = m.id
    WHERE m.chama_id = chama_uuid 
    AND m.scheduled_date BETWEEN metric_period_start AND metric_period_end;
    
    -- Calculate member retention rate (simplified)
    SELECT 
        CASE 
            WHEN COUNT(*) > 0 THEN 
                (COUNT(CASE WHEN status = 'active' THEN 1 END) * 100.0 / COUNT(*))
            ELSE 0 
        END INTO member_retention_rate
    FROM chama_members 
    WHERE chama_id = chama_uuid;
    
    -- Build result JSON
    result := jsonb_build_object(
        'contribution_rate', contribution_rate,
        'loan_repayment_rate', loan_repayment_rate,
        'meeting_attendance_rate', meeting_attendance_rate,
        'member_retention_rate', member_retention_rate,
        'calculated_at', NOW(),
        'period_start', metric_period_start,
        'period_end', metric_period_end
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to send notifications (placeholder for Django integration)
CREATE OR REPLACE FUNCTION queue_notification(
    notification_chama_id UUID,
    notification_user_id UUID,
    notification_title VARCHAR(255),
    notification_message TEXT,
    notification_type VARCHAR(50) DEFAULT 'info',
    notification_channels JSONB DEFAULT '["app"]'::jsonb
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (
        chama_id, user_id, title, message, notification_type, channels
    ) VALUES (
        notification_chama_id, notification_user_id, notification_title, 
        notification_message, notification_type, notification_channels
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to archive old transactions
CREATE OR REPLACE FUNCTION archive_old_transactions(months_to_keep INTEGER DEFAULT 24)
RETURNS INTEGER AS $$
DECLARE
    archived_count INTEGER;
    archive_date DATE;
BEGIN
    archive_date := CURRENT_DATE - INTERVAL '1 month' * months_to_keep;
    
    -- This is a placeholder - implement based on your archival strategy
    -- You might move to archive tables or external storage
    
    -- For now, just count what would be archived
    SELECT COUNT(*) INTO archived_count
    FROM transactions 
    WHERE payment_date < archive_date;
    
    RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM notifications 
    WHERE expires_at IS NOT NULL AND expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update member financial summary
CREATE OR REPLACE FUNCTION update_member_financial_summary(member_uuid UUID, chama_uuid UUID)
RETURNS VOID AS $$
DECLARE
    total_contribs DECIMAL(15,2);
    current_bal DECIMAL(15,2);
    outstanding_loans_total DECIMAL(15,2);
    penalty_bal DECIMAL(15,2);
BEGIN
    -- Calculate total contributions
    SELECT COALESCE(SUM(actual_amount), 0) INTO total_contribs
    FROM contributions 
    WHERE member_id = member_uuid AND chama_id = chama_uuid AND status = 'completed';
    
    -- Calculate current balance (simplified calculation)
    current_bal := total_contribs; -- This would be more complex in real implementation
    
    -- Calculate outstanding loans
    SELECT COALESCE(SUM(outstanding_balance), 0) INTO outstanding_loans_total
    FROM loans 
    WHERE borrower_id = member_uuid AND chama_id = chama_uuid AND status = 'active';
    
    -- Calculate penalty balance
    SELECT COALESCE(SUM(penalty_amount), 0) INTO penalty_bal
    FROM loans 
    WHERE borrower_id = member_uuid AND chama_id = chama_uuid;
    
    -- Update member record
    UPDATE chama_members 
    SET 
        total_contributions = total_contribs,
        current_balance = current_bal,
        outstanding_loans = outstanding_loans_total,
        penalty_balance = penalty_bal,
        updated_at = NOW()
    WHERE user_id = member_uuid AND chama_id = chama_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CLEANUP AND MAINTENANCE FUNCTIONS (ENHANCED)
-- ============================================================================

-- Function to archive old transactions
CREATE OR REPLACE FUNCTION archive_old_transactions(months_to_keep INTEGER DEFAULT 24)
RETURNS INTEGER AS $$
DECLARE
    archived_count INTEGER;
BEGIN
    -- This is a placeholder - implement based on your archival strategy
    -- You might move to archive tables or external storage
    RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM notifications 
    WHERE expires_at IS NOT NULL AND expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Grant appropriate permissions (customize based on your application users)
-- GRANT USAGE ON SCHEMA public TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
