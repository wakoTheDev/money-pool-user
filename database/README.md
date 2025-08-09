# MoneyPool Database Schema Documentation

## Overview

This comprehensive database schema is designed to support the MoneyPool chama management application with all its enhanced features including:

- **Core Chama Management**: Groups, members, roles, and basic operations
- **Financial Management**: Contributions, loans, transactions, and investments
- **Meeting Management**: Scheduling, attendance, and governance
- **Enhanced Features**: Goals tracking, advanced analytics, and reporting
- **Administrative Features**: User management, system settings, and audit trails
- **Security & Compliance**: Row-level security, audit logging, and data protection

## Database Design Principles

### 1. **Scalability**
- UUID primary keys for better distribution and avoiding conflicts
- Proper indexing strategy for performance
- Partitioning-ready design for large datasets
- Efficient query patterns with optimized views

### 2. **Data Integrity**
- Foreign key constraints maintain referential integrity
- Check constraints ensure data validity
- Generated columns for calculated fields
- Comprehensive audit trail

### 3. **Flexibility**
- JSONB fields for extensible metadata
- Configurable system settings
- Multiple chama types and categories
- Extensible permission system

### 4. **Security**
- Row-level security (RLS) policies
- Audit logging for sensitive operations
- Encrypted sensitive data support
- Role-based access control

## Core Entities and Relationships

### 1. **Users Management**

#### `users` table
Central user management with comprehensive profile and security features.

**Key Features:**
- Complete user profiles with KYC support
- Multi-factor authentication support
- Account status management
- Role-based permissions
- Security tracking (failed logins, account locks)

**Security Fields:**
```sql
status VARCHAR(20) -- active, suspended, inactive, pending
kyc_status VARCHAR(20) -- pending, verified, rejected, expired
two_factor_enabled BOOLEAN
failed_login_attempts INTEGER
account_locked_until TIMESTAMP
```

### 2. **Chama Management**

#### `chamas` table
Core group/chama entity with comprehensive configuration options.

**Key Features:**
- Multiple chama categories (savings, investment, credit, mixed)
- Flexible contribution and meeting schedules
- Financial settings and loan parameters
- Geographic and timezone support
- Status lifecycle management

**Financial Configuration:**
```sql
min_contribution_amount DECIMAL(15,2)
contribution_frequency VARCHAR(20) -- weekly, monthly, quarterly, yearly, flexible
loan_interest_rate DECIMAL(5,2)
max_loan_multiplier DECIMAL(3,1) -- Max loan as multiple of contributions
penalty_rate DECIMAL(5,2)
```

#### `chama_members` table
Links users to chamas with roles and financial tracking.

**Key Features:**
- Role-based membership (leader, treasurer, secretary, member)
- Individual permission overrides
- Real-time financial balances
- Membership lifecycle tracking

### 3. **Financial Management**

#### `transactions` table
Central transaction ledger for all financial movements.

**Transaction Types:**
- `contribution` - Regular and special contributions
- `loan_disbursement` - Loan payouts
- `loan_repayment` - Loan payments
- `penalty` - Late fees and penalties
- `interest` - Interest earnings
- `withdrawal` - Member withdrawals
- `fee` - Administrative fees
- `adjustment` - Manual adjustments
- `transfer` - Inter-account transfers

**Key Features:**
- Complete payment method tracking
- Fee calculation and tracking
- Status workflow management
- External payment reference linking
- Comprehensive audit trail

#### `contributions` table
Detailed contribution tracking with period-based organization.

**Key Features:**
- Period-based tracking (yearly, monthly, weekly)
- Expected vs actual amount tracking
- Late payment calculation
- Multiple contribution types
- Waiver support with approval workflow

#### `loans` table
Comprehensive loan management system.

**Loan Lifecycle:**
1. **Application** - Member applies with purpose and guarantors
2. **Approval** - Admin review and approval/rejection
3. **Disbursement** - Funds transfer to member
4. **Repayment** - Scheduled payments tracking
5. **Completion/Default** - Final status resolution

**Key Features:**
- Multiple interest calculation methods
- Flexible repayment schedules
- Collateral and guarantor tracking
- Default management and recovery
- Write-off capability

#### `loan_repayments` table
Individual loan payment schedule and tracking.

**Features:**
- Automated payment schedule generation
- Principal and interest breakdown
- Penalty calculation for late payments
- Partial payment support
- Payment method tracking

### 4. **Meetings and Governance**

#### `meetings` table
Comprehensive meeting management system.

**Meeting Types:**
- `regular` - Scheduled recurring meetings
- `special` - Special purpose meetings
- `annual` - Annual general meetings
- `emergency` - Urgent meetings
- `committee` - Committee meetings

**Key Features:**
- Multi-format meetings (physical, virtual, hybrid)
- Agenda and documentation management
- Quorum tracking
- Resolutions and action items
- Meeting outcome recording

#### `meeting_attendance` table
Detailed attendance tracking with participation metrics.

**Features:**
- Attendance status tracking
- Arrival/departure time logging
- Participation quality metrics
- Excuse management
- Voting participation tracking

### 5. **Enhanced Features**

#### `goals` table
Advanced goal setting and tracking system.

**Goal Types:**
- `savings` - Savings targets
- `investment` - Investment goals
- `loan_disbursement` - Lending targets
- `membership` - Growth goals
- `project` - Special projects

**Features:**
- Progress tracking with milestones
- Automated progress calculation
- Category-based organization
- Completion status management

#### `investments` table
Investment portfolio management.

**Investment Types:**
- `stocks` - Equity investments
- `bonds` - Fixed income securities
- `real_estate` - Property investments
- `mutual_funds` - Fund investments
- `fixed_deposit` - Bank deposits
- `business` - Business investments

**Features:**
- ROI calculation and tracking
- Risk level assessment
- Broker and account management
- Document storage
- Performance analytics

#### `notifications` table
Multi-channel notification system.

**Delivery Channels:**
- `app` - In-app notifications
- `email` - Email delivery
- `sms` - SMS messaging
- `push` - Push notifications

**Features:**
- Priority-based delivery
- Multi-channel support
- Read tracking
- Expiration management
- Context linking to related entities

### 6. **System Administration**

#### `system_settings` table
Flexible configuration management.

**Setting Categories:**
- `general` - Basic application settings
- `financial` - Financial defaults and limits
- `security` - Security policies
- `notifications` - Notification preferences

**Features:**
- Global and chama-specific settings
- Type validation support
- Encryption support for sensitive settings
- System-protected settings

#### `audit_logs` table
Comprehensive audit trail for all significant operations.

**Tracked Actions:**
- `create` - Entity creation
- `update` - Modifications
- `delete` - Deletions
- `approve` - Approvals
- `reject` - Rejections
- `suspend` - Suspensions
- `activate` - Activations

**Features:**
- Before/after value tracking
- Changed fields identification
- Context information (IP, user agent, session)
- Severity classification
- Request correlation

#### `reports` table
Generated reports tracking and management.

**Report Types:**
- `financial` - Financial statements
- `membership` - Member reports
- `attendance` - Meeting attendance
- `loans` - Loan portfolio reports
- `investments` - Investment performance
- `regulatory` - Compliance reports

**Features:**
- Parameter storage for reproducibility
- File format support (PDF, Excel, CSV, JSON)
- Access control and sharing
- Download tracking
- Automatic expiration

## Performance Optimization

### Indexing Strategy

**Primary Indexes:**
- All primary keys (UUID) with B-tree indexes
- Foreign key relationships for join optimization
- Status fields for filtering
- Date fields for time-based queries
- Amount fields for financial calculations

**Composite Indexes:**
- `(chama_id, member_id)` for member-specific queries
- `(period_year, period_month)` for contribution periods
- `(entity_type, entity_id)` for audit log queries

### Query Optimization

**Materialized Views:**
Consider implementing materialized views for:
- Chama financial summaries
- Member performance metrics
- Monthly/quarterly reports
- Investment portfolio summaries

**Partitioning Strategy:**
For large deployments, consider partitioning:
- `transactions` by date (monthly/quarterly)
- `audit_logs` by date (monthly)
- `notifications` by date (monthly)

## Security Implementation

### Row-Level Security (RLS)

**Policy Examples:**
```sql
-- Members can only see data from their chamas
CREATE POLICY chama_data_access ON transactions
FOR ALL USING (
    chama_id IN (
        SELECT chama_id FROM chama_members 
        WHERE user_id = current_setting('app.current_user_id')::UUID
        AND status = 'active'
    )
    OR current_setting('app.current_user_role') IN ('admin', 'super_admin')
);
```

### Data Protection

**Sensitive Data Handling:**
- Passwords: bcrypt hashing
- Personal data: Encryption at rest
- Financial data: Audit trail required
- Communication: TLS encryption

## Migration Strategy

### Phase 1: Core Tables
1. Users and authentication
2. Chamas and membership
3. Basic transactions

### Phase 2: Financial Features
1. Contributions system
2. Loans management
3. Payment tracking

### Phase 3: Enhanced Features
1. Meetings and governance
2. Goals and investments
3. Notifications system

### Phase 4: Administration
1. System settings
2. Audit logging
3. Reporting system

## Maintenance Procedures

### Regular Maintenance
```sql
-- Daily: Clean up expired notifications
SELECT cleanup_expired_notifications();

-- Weekly: Update investment valuations
-- (Custom procedure based on external data sources)

-- Monthly: Generate automatic reports
-- (Custom procedure for scheduled reports)

-- Quarterly: Archive old transactions
SELECT archive_old_transactions(24); -- Keep 24 months
```

### Backup Strategy
- **Full backup**: Weekly
- **Incremental backup**: Daily
- **Point-in-time recovery**: Transaction log backup every 15 minutes
- **Cross-region replication**: For disaster recovery

## API Integration Points

### External Services
- **Payment Gateways**: M-Pesa, bank APIs
- **KYC Services**: Identity verification
- **SMS/Email**: Notification delivery
- **Investment Data**: Market data feeds

### Webhook Support
- Payment confirmations
- KYC status updates
- Investment price updates
- Regulatory reporting

## Compliance and Regulatory

### Data Retention
- **Financial records**: 7 years minimum
- **User data**: Until account deletion + 1 year
- **Audit logs**: 5 years minimum
- **Communication logs**: 2 years

### GDPR Compliance
- Right to erasure implementation
- Data portability support
- Consent management
- Audit trail for data access

### Financial Regulations
- Anti-money laundering (AML) tracking
- Know Your Customer (KYC) compliance
- Transaction reporting requirements
- Interest rate compliance

## Performance Monitoring

### Key Metrics
- **Query performance**: Response time < 100ms for 95% of queries
- **Transaction throughput**: Support 1000+ concurrent transactions
- **Data growth**: Monitor table sizes and partition requirements
- **Index effectiveness**: Regular index usage analysis

### Alerting Thresholds
- Failed login attempts > 5 per minute
- Large transactions > configured limits
- System errors > 1% of requests
- Database connection pool > 80% utilization

This schema provides a robust foundation for the MoneyPool application while maintaining flexibility for future enhancements and compliance with financial industry standards.
