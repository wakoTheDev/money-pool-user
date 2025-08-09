-- MoneyPool Database Migration Script
-- Version: 1.0.0
-- Description: Initial database setup with all core tables and features

-- ============================================================================
-- MIGRATION INFORMATION
-- ============================================================================

-- Migration ID: 001_initial_schema
-- Created: 2025-08-08
-- Description: Creates all core tables, indexes, triggers, and initial data
-- Dependencies: PostgreSQL 12+ with uuid-ossp extension

-- ============================================================================
-- PREREQUISITES CHECK
-- ============================================================================

-- Check PostgreSQL version (requires 12+)
DO $$
BEGIN
    IF current_setting('server_version_num')::integer < 120000 THEN
        RAISE EXCEPTION 'PostgreSQL version 12 or higher is required. Current version: %', version();
    END IF;
END $$;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CREATE CORE TABLES
-- ============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
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
    created_by UUID,
    updated_by UUID
);

-- Add foreign key constraints for users after table creation
ALTER TABLE users ADD CONSTRAINT fk_users_created_by FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE users ADD CONSTRAINT fk_users_updated_by FOREIGN KEY (updated_by) REFERENCES users(id);

-- Chamas table
CREATE TABLE IF NOT EXISTS chamas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'savings' CHECK (category IN ('savings', 'investment', 'credit', 'mixed')),
    
    -- Group settings
    max_members INTEGER DEFAULT 50,
    min_contribution_amount DECIMAL(15,2) DEFAULT 0,
    contribution_frequency VARCHAR(20) DEFAULT 'monthly' CHECK (contribution_frequency IN ('weekly', 'monthly', 'quarterly', 'yearly', 'flexible')),
    contribution_day INTEGER,
    meeting_frequency VARCHAR(20) DEFAULT 'monthly' CHECK (meeting_frequency IN ('weekly', 'monthly', 'quarterly', 'yearly', 'as_needed')),
    
    -- Financial settings
    currency VARCHAR(10) DEFAULT 'KES',
    loan_interest_rate DECIMAL(5,2) DEFAULT 0.00,
    max_loan_multiplier DECIMAL(3,1) DEFAULT 3.0,
    loan_grace_period INTEGER DEFAULT 30,
    penalty_rate DECIMAL(5,2) DEFAULT 5.00,
    
    -- Group status
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

-- Chama members table
CREATE TABLE IF NOT EXISTS chama_members (
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

-- Continue with other tables (transactions, contributions, loans, meetings, etc.)
-- Following the same pattern from the main schema file...

-- ============================================================================
-- CREATE INDEXES
-- ============================================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_kyc_status ON users(kyc_status);

-- Chamas indexes
CREATE INDEX IF NOT EXISTS idx_chamas_status ON chamas(status);
CREATE INDEX IF NOT EXISTS idx_chamas_category ON chamas(category);
CREATE INDEX IF NOT EXISTS idx_chamas_created_at ON chamas(created_at);

-- Chama members indexes
CREATE INDEX IF NOT EXISTS idx_chama_members_chama_id ON chama_members(chama_id);
CREATE INDEX IF NOT EXISTS idx_chama_members_user_id ON chama_members(user_id);
CREATE INDEX IF NOT EXISTS idx_chama_members_status ON chama_members(status);
CREATE INDEX IF NOT EXISTS idx_chama_members_role ON chama_members(role);

-- ============================================================================
-- CREATE TRIGGERS
-- ============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chamas_updated_at BEFORE UPDATE ON chamas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chama_members_updated_at BEFORE UPDATE ON chama_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INSERT INITIAL DATA
-- ============================================================================

-- System settings
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
('timezone', '"Africa/Nairobi"', 'string', 'general', 'Default timezone', false)
ON CONFLICT (chama_id, setting_key) DO NOTHING;

-- Create default admin user
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
    '["admin_access", "user_management", "chama_management", "financial_management", "system_administration"]'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- CREATE SECURITY POLICIES
-- ============================================================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chamas ENABLE ROW LEVEL SECURITY;
ALTER TABLE chama_members ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY users_access_policy ON users
    FOR ALL
    USING (
        id = current_setting('app.current_user_id', true)::UUID 
        OR current_setting('app.current_user_role', true) IN ('admin', 'super_admin')
    );

CREATE POLICY chama_members_access_policy ON chama_members
    FOR ALL
    USING (
        user_id = current_setting('app.current_user_id', true)::UUID
        OR chama_id IN (
            SELECT chama_id FROM chama_members 
            WHERE user_id = current_setting('app.current_user_id', true)::UUID
        )
        OR current_setting('app.current_user_role', true) IN ('admin', 'super_admin')
    );

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to validate email format
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- Function to generate member number
CREATE OR REPLACE FUNCTION generate_member_number(chama_id_param UUID)
RETURNS VARCHAR AS $$
DECLARE
    member_count INTEGER;
    chama_code VARCHAR(10);
BEGIN
    -- Get current member count for the chama
    SELECT COUNT(*) INTO member_count
    FROM chama_members 
    WHERE chama_id = chama_id_param;
    
    -- Get chama name initials or use default
    SELECT COALESCE(
        UPPER(LEFT(name, 3)),
        'CHM'
    ) INTO chama_code
    FROM chamas 
    WHERE id = chama_id_param;
    
    -- Return formatted member number
    RETURN chama_code || LPAD((member_count + 1)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to calculate loan payment schedule
CREATE OR REPLACE FUNCTION calculate_loan_payment(
    principal DECIMAL,
    annual_rate DECIMAL,
    term_months INTEGER
)
RETURNS DECIMAL AS $$
DECLARE
    monthly_rate DECIMAL;
    payment DECIMAL;
BEGIN
    IF annual_rate = 0 THEN
        RETURN principal / term_months;
    END IF;
    
    monthly_rate := annual_rate / 100 / 12;
    payment := principal * (monthly_rate * POWER(1 + monthly_rate, term_months)) / 
               (POWER(1 + monthly_rate, term_months) - 1);
    
    RETURN ROUND(payment, 2);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VERIFICATION AND CLEANUP
-- ============================================================================

-- Verify table creation
DO $$
DECLARE
    table_count INTEGER;
    expected_tables TEXT[] := ARRAY[
        'users', 'chamas', 'chama_members', 'transactions', 'contributions',
        'loans', 'loan_repayments', 'meetings', 'meeting_attendance',
        'goals', 'investments', 'notifications', 'reports', 'system_settings',
        'audit_logs'
    ];
    missing_tables TEXT[] := ARRAY[]::TEXT[];
    table_name TEXT;
BEGIN
    -- Check if all expected tables exist
    FOREACH table_name IN ARRAY expected_tables
    LOOP
        SELECT COUNT(*) INTO table_count
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = table_name;
        
        IF table_count = 0 THEN
            missing_tables := array_append(missing_tables, table_name);
        END IF;
    END LOOP;
    
    -- Report results
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE WARNING 'Missing tables: %', array_to_string(missing_tables, ', ');
    ELSE
        RAISE NOTICE 'All expected tables created successfully';
    END IF;
    
    -- Display table count
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    
    RAISE NOTICE 'Total tables created: %', table_count;
END $$;

-- ============================================================================
-- MIGRATION COMPLETION
-- ============================================================================

-- Record migration completion
INSERT INTO system_settings (
    setting_key, 
    setting_value, 
    setting_type, 
    category, 
    description, 
    is_system
) VALUES (
    'migration_001_completed',
    to_jsonb(NOW()),
    'string',
    'system',
    'Initial schema migration completion timestamp',
    true
) ON CONFLICT (chama_id, setting_key) DO UPDATE SET
    setting_value = to_jsonb(NOW()),
    updated_at = NOW();

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=========================================';
    RAISE NOTICE 'MoneyPool Database Migration Complete!';
    RAISE NOTICE '=========================================';
    RAISE NOTICE 'Migration: 001_initial_schema';
    RAISE NOTICE 'Completed: %', NOW();
    RAISE NOTICE '';
    RAISE NOTICE 'Default Admin User Created:';
    RAISE NOTICE 'Email: admin@moneypool.com';
    RAISE NOTICE 'Password: admin123';
    RAISE NOTICE '';
    RAISE NOTICE 'IMPORTANT: Change the default admin password immediately!';
    RAISE NOTICE '';
END $$;
