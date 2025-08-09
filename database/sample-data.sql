-- Sample data for MoneyPool application development and testing
-- This file provides realistic test data for all major entities

-- ============================================================================
-- SAMPLE CHAMAS
-- ============================================================================

-- Create sample chamas with different categories and configurations
INSERT INTO chamas (
    id, name, description, category, max_members, min_contribution_amount,
    contribution_frequency, contribution_day, meeting_frequency,
    currency, loan_interest_rate, max_loan_multiplier, loan_grace_period,
    penalty_rate, status, location, meeting_location, meeting_time,
    terms_and_conditions, created_by
) VALUES 
(
    gen_random_uuid(),
    'Kibera Savings Circle',
    'A community-based savings group focused on improving the livelihoods of Kibera residents through collective savings and micro-loans.',
    'savings',
    30,
    1000.00,
    'weekly',
    7, -- Sunday
    'weekly',
    'KES',
    12.00,
    3.0,
    7,
    5.00,
    'active',
    'Kibera, Nairobi',
    'Kibera Community Hall',
    '14:00:00',
    'Members must contribute weekly. Loans are available after 3 months of consistent contributions.',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
),
(
    gen_random_uuid(),
    'Mombasa Investment Club',
    'Investment-focused group targeting middle-class professionals in Mombasa for wealth building through diversified investments.',
    'investment',
    20,
    5000.00,
    'monthly',
    1, -- 1st of month
    'monthly',
    'KES',
    8.00,
    2.5,
    30,
    3.00,
    'active',
    'Mombasa',
    'Serena Hotel Mombasa - Conference Room A',
    '10:00:00',
    'Professional investment club with focus on stocks, bonds, and real estate. Minimum investment knowledge required.',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
),
(
    gen_random_uuid(),
    'Nakuru Farmers Cooperative',
    'Agricultural cooperative supporting local farmers with credit facilities and equipment sharing.',
    'credit',
    50,
    2000.00,
    'monthly',
    15, -- 15th of month
    'monthly',
    'KES',
    15.00,
    4.0,
    60,
    8.00,
    'active',
    'Nakuru',
    'Nakuru Agricultural Training Centre',
    '09:00:00',
    'Farmers cooperative providing agricultural loans and equipment. Collateral required for loans above KES 50,000.',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
),
(
    gen_random_uuid(),
    'Youth Entrepreneurs Network',
    'Young professionals and entrepreneurs pooling resources for business development and startup funding.',
    'mixed',
    25,
    3000.00,
    'monthly',
    1,
    'monthly',
    'KES',
    10.00,
    3.5,
    14,
    6.00,
    'active',
    'Nairobi CBD',
    'iHub Nairobi',
    '18:00:00',
    'Network for young entrepreneurs. Business plan required for loans above KES 100,000.',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
);

-- ============================================================================
-- SAMPLE USERS
-- ============================================================================

-- Create sample users for different chamas
INSERT INTO users (
    id, email, phone, password_hash, first_name, last_name, middle_name,
    date_of_birth, gender, national_id, status, email_verified, phone_verified,
    kyc_status, role, created_by
) VALUES 
-- Kibera Savings Circle Members
(
    gen_random_uuid(),
    'mary.wanjiku@gmail.com',
    '+254722123456',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFNKNiLkUcjt1cq',
    'Mary',
    'Wanjiku',
    'Njeri',
    '1985-03-15',
    'female',
    '28345612',
    'active',
    true,
    true,
    'verified',
    'member',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
),
(
    gen_random_uuid(),
    'john.kamau@yahoo.com',
    '+254733987654',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFNKNiLkUcjt1cq',
    'John',
    'Kamau',
    'Mwangi',
    '1978-11-22',
    'male',
    '21789456',
    'active',
    true,
    true,
    'verified',
    'member',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
),
(
    gen_random_uuid(),
    'grace.achieng@outlook.com',
    '+254744123789',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFNKNiLkUcjt1cq',
    'Grace',
    'Achieng',
    'Otieno',
    '1992-07-08',
    'female',
    '32156789',
    'active',
    true,
    true,
    'verified',
    'member',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
),
-- Mombasa Investment Club Members
(
    gen_random_uuid(),
    'ahmed.hassan@outlook.com',
    '+254755456123',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFNKNiLkUcjt1cq',
    'Ahmed',
    'Hassan',
    'Ali',
    '1980-01-30',
    'male',
    '24567890',
    'active',
    true,
    true,
    'verified',
    'member',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
),
(
    gen_random_uuid(),
    'fatima.mohamed@gmail.com',
    '+254766789012',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFNKNiLkUcjt1cq',
    'Fatima',
    'Mohamed',
    'Said',
    '1987-05-12',
    'female',
    '29123456',
    'active',
    true,
    true,
    'verified',
    'member',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
),
-- Nakuru Farmers Cooperative Members
(
    gen_random_uuid(),
    'peter.kimani@farmer.co.ke',
    '+254777234567',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFNKNiLkUcjt1cq',
    'Peter',
    'Kimani',
    'Mwangi',
    '1975-09-25',
    'male',
    '19876543',
    'active',
    true,
    true,
    'verified',
    'member',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
),
(
    gen_random_uuid(),
    'jane.wambui@agriculture.gov.ke',
    '+254788345678',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFNKNiLkUcjt1cq',
    'Jane',
    'Wambui',
    'Karanja',
    '1982-12-03',
    'female',
    '26543210',
    'active',
    true,
    true,
    'verified',
    'member',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
),
-- Youth Entrepreneurs Network Members
(
    gen_random_uuid(),
    'kevin.otieno@startup.ke',
    '+254799456789',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFNKNiLkUcjt1cq',
    'Kevin',
    'Otieno',
    'Ochieng',
    '1995-04-18',
    'male',
    '33789012',
    'active',
    true,
    true,
    'pending',
    'member',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
),
(
    gen_random_uuid(),
    'sarah.mutua@tech.co.ke',
    '+254700567890',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFNKNiLkUcjt1cq',
    'Sarah',
    'Mutua',
    'Ndunge',
    '1993-08-14',
    'female',
    '31456789',
    'active',
    true,
    true,
    'verified',
    'member',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
);

-- ============================================================================
-- CHAMA MEMBERSHIPS
-- ============================================================================

-- Assign users to chamas with different roles
WITH chama_data AS (
    SELECT id, name FROM chamas
),
user_data AS (
    SELECT id, email, first_name, last_name FROM users WHERE email != 'admin@moneypool.com'
)
INSERT INTO chama_members (
    chama_id, user_id, role, member_number, join_date, status,
    total_contributions, current_balance, created_by
)
SELECT 
    c.id,
    u.id,
    CASE 
        WHEN u.email = 'mary.wanjiku@gmail.com' THEN 'leader'
        WHEN u.email = 'john.kamau@yahoo.com' THEN 'treasurer'
        WHEN u.email = 'ahmed.hassan@outlook.com' THEN 'leader'
        WHEN u.email = 'fatima.mohamed@gmail.com' THEN 'secretary'
        WHEN u.email = 'peter.kimani@farmer.co.ke' THEN 'leader'
        WHEN u.email = 'jane.wambui@agriculture.gov.ke' THEN 'treasurer'
        WHEN u.email = 'kevin.otieno@startup.ke' THEN 'leader'
        WHEN u.email = 'sarah.mutua@tech.co.ke' THEN 'secretary'
        ELSE 'member'
    END as role,
    CASE c.name
        WHEN 'Kibera Savings Circle' THEN 
            CASE u.email
                WHEN 'mary.wanjiku@gmail.com' THEN 'KIB001'
                WHEN 'john.kamau@yahoo.com' THEN 'KIB002'
                WHEN 'grace.achieng@outlook.com' THEN 'KIB003'
            END
        WHEN 'Mombasa Investment Club' THEN
            CASE u.email
                WHEN 'ahmed.hassan@outlook.com' THEN 'MIC001'
                WHEN 'fatima.mohamed@gmail.com' THEN 'MIC002'
            END
        WHEN 'Nakuru Farmers Cooperative' THEN
            CASE u.email
                WHEN 'peter.kimani@farmer.co.ke' THEN 'NFC001'
                WHEN 'jane.wambui@agriculture.gov.ke' THEN 'NFC002'
            END
        WHEN 'Youth Entrepreneurs Network' THEN
            CASE u.email
                WHEN 'kevin.otieno@startup.ke' THEN 'YEN001'
                WHEN 'sarah.mutua@tech.co.ke' THEN 'YEN002'
            END
    END as member_number,
    CURRENT_DATE - INTERVAL '6 months' as join_date,
    'active',
    -- Simulate 6 months of contributions
    CASE c.name
        WHEN 'Kibera Savings Circle' THEN 26000.00 -- 26 weeks * 1000
        WHEN 'Mombasa Investment Club' THEN 30000.00 -- 6 months * 5000
        WHEN 'Nakuru Farmers Cooperative' THEN 12000.00 -- 6 months * 2000
        WHEN 'Youth Entrepreneurs Network' THEN 18000.00 -- 6 months * 3000
    END as total_contributions,
    CASE c.name
        WHEN 'Kibera Savings Circle' THEN 24000.00
        WHEN 'Mombasa Investment Club' THEN 28000.00
        WHEN 'Nakuru Farmers Cooperative' THEN 10000.00
        WHEN 'Youth Entrepreneurs Network' THEN 16000.00
    END as current_balance,
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
FROM chama_data c
JOIN user_data u ON (
    (c.name = 'Kibera Savings Circle' AND u.email IN ('mary.wanjiku@gmail.com', 'john.kamau@yahoo.com', 'grace.achieng@outlook.com')) OR
    (c.name = 'Mombasa Investment Club' AND u.email IN ('ahmed.hassan@outlook.com', 'fatima.mohamed@gmail.com')) OR
    (c.name = 'Nakuru Farmers Cooperative' AND u.email IN ('peter.kimani@farmer.co.ke', 'jane.wambui@agriculture.gov.ke')) OR
    (c.name = 'Youth Entrepreneurs Network' AND u.email IN ('kevin.otieno@startup.ke', 'sarah.mutua@tech.co.ke'))
);

-- ============================================================================
-- SAMPLE TRANSACTIONS
-- ============================================================================

-- Generate sample contribution transactions
INSERT INTO transactions (
    chama_id, member_id, transaction_type, transaction_number,
    amount, currency, payment_method, payment_reference,
    status, description, payment_date, created_by
)
SELECT 
    cm.chama_id,
    cm.user_id,
    'contribution',
    'TXN' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
    CASE c.name
        WHEN 'Kibera Savings Circle' THEN 1000.00
        WHEN 'Mombasa Investment Club' THEN 5000.00
        WHEN 'Nakuru Farmers Cooperative' THEN 2000.00
        WHEN 'Youth Entrepreneurs Network' THEN 3000.00
    END,
    'KES',
    CASE FLOOR(RANDOM() * 3)
        WHEN 0 THEN 'mobile_money'
        WHEN 1 THEN 'bank_transfer'
        ELSE 'cash'
    END,
    'REF' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
    'confirmed',
    'Monthly contribution payment',
    CURRENT_DATE - INTERVAL '1 month',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
FROM chama_members cm
JOIN chamas c ON cm.chama_id = c.id
WHERE cm.status = 'active';

-- ============================================================================
-- SAMPLE CONTRIBUTIONS
-- ============================================================================

-- Create contribution records for the last 3 months
INSERT INTO contributions (
    chama_id, member_id, transaction_id, contribution_type,
    period_year, period_month, expected_amount, actual_amount,
    due_date, paid_date, status, created_by
)
SELECT 
    cm.chama_id,
    cm.user_id,
    t.id,
    'regular',
    EXTRACT(YEAR FROM CURRENT_DATE),
    EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month'),
    t.amount,
    t.amount,
    CURRENT_DATE - INTERVAL '1 month',
    t.payment_date,
    'completed',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
FROM chama_members cm
JOIN transactions t ON cm.chama_id = t.chama_id AND cm.user_id = t.member_id
WHERE t.transaction_type = 'contribution';

-- ============================================================================
-- SAMPLE LOANS
-- ============================================================================

-- Create sample loans for some members
INSERT INTO loans (
    chama_id, borrower_id, loan_number, loan_type,
    principal_amount, interest_rate, interest_type, term_months,
    first_payment_date, final_payment_date, status,
    purpose, application_date, approved_by, approved_at,
    disbursed_by, disbursed_at, disbursed_amount,
    outstanding_balance, created_by
)
SELECT 
    cm.chama_id,
    cm.user_id,
    'LN' || LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0'),
    CASE FLOOR(RANDOM() * 4)
        WHEN 0 THEN 'personal'
        WHEN 1 THEN 'business'
        WHEN 2 THEN 'emergency'
        ELSE 'development'
    END,
    CASE c.name
        WHEN 'Kibera Savings Circle' THEN 15000.00
        WHEN 'Mombasa Investment Club' THEN 75000.00
        WHEN 'Nakuru Farmers Cooperative' THEN 40000.00
        WHEN 'Youth Entrepreneurs Network' THEN 50000.00
    END as principal_amount,
    c.loan_interest_rate,
    'simple',
    12, -- 12 months term
    CURRENT_DATE + INTERVAL '1 month',
    CURRENT_DATE + INTERVAL '13 months',
    'active',
    CASE FLOOR(RANDOM() * 4)
        WHEN 0 THEN 'School fees for children'
        WHEN 1 THEN 'Small business expansion'
        WHEN 2 THEN 'Medical emergency'
        ELSE 'Home improvement'
    END,
    CURRENT_DATE - INTERVAL '2 weeks',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com'),
    CURRENT_DATE - INTERVAL '1 week',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com'),
    CURRENT_DATE - INTERVAL '3 days',
    CASE c.name
        WHEN 'Kibera Savings Circle' THEN 15000.00
        WHEN 'Mombasa Investment Club' THEN 75000.00
        WHEN 'Nakuru Farmers Cooperative' THEN 40000.00
        WHEN 'Youth Entrepreneurs Network' THEN 50000.00
    END,
    CASE c.name
        WHEN 'Kibera Savings Circle' THEN 14200.00
        WHEN 'Mombasa Investment Club' THEN 72500.00
        WHEN 'Nakuru Farmers Cooperative' THEN 38000.00
        WHEN 'Youth Entrepreneurs Network' THEN 47500.00
    END,
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
FROM chama_members cm
JOIN chamas c ON cm.chama_id = c.id
WHERE cm.role IN ('leader', 'treasurer') -- Only leaders and treasurers get loans in this sample
  AND cm.status = 'active';

-- ============================================================================
-- SAMPLE MEETINGS
-- ============================================================================

-- Create sample meetings for each chama
INSERT INTO meetings (
    chama_id, title, meeting_type, description, agenda,
    scheduled_date, start_time, end_time, location,
    status, expected_attendees, actual_attendees,
    quorum_met, chairperson_id, secretary_id,
    minutes, created_by
)
SELECT 
    c.id,
    CASE c.meeting_frequency
        WHEN 'weekly' THEN 'Weekly Savings Meeting'
        WHEN 'monthly' THEN 'Monthly General Meeting'
        ELSE 'Regular Meeting'
    END,
    'regular',
    'Regular group meeting for contributions, loans, and general business',
    '[
        "Opening and roll call",
        "Minutes of previous meeting",
        "Financial report",
        "Loan applications review",
        "New business",
        "Next meeting date",
        "Closing"
    ]'::jsonb,
    CURRENT_DATE + INTERVAL '1 week',
    c.meeting_time,
    c.meeting_time + INTERVAL '2 hours',
    c.meeting_location,
    'scheduled',
    (SELECT COUNT(*) FROM chama_members WHERE chama_id = c.id AND status = 'active'),
    0,
    false,
    (SELECT cm.user_id FROM chama_members cm WHERE cm.chama_id = c.id AND cm.role = 'leader' LIMIT 1),
    (SELECT cm.user_id FROM chama_members cm WHERE cm.chama_id = c.id AND cm.role = 'secretary' LIMIT 1),
    null,
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
FROM chamas c
WHERE c.status = 'active';

-- Create a completed meeting for each chama
INSERT INTO meetings (
    chama_id, title, meeting_type, description,
    scheduled_date, start_time, end_time, location,
    status, expected_attendees, actual_attendees,
    quorum_met, chairperson_id, secretary_id,
    minutes, created_by
)
SELECT 
    c.id,
    'Previous Month Meeting',
    'regular',
    'Completed monthly meeting',
    CURRENT_DATE - INTERVAL '1 month',
    c.meeting_time,
    c.meeting_time + INTERVAL '2 hours',
    c.meeting_location,
    'completed',
    (SELECT COUNT(*) FROM chama_members WHERE chama_id = c.id AND status = 'active'),
    (SELECT COUNT(*) FROM chama_members WHERE chama_id = c.id AND status = 'active'),
    true,
    (SELECT cm.user_id FROM chama_members cm WHERE cm.chama_id = c.id AND cm.role = 'leader' LIMIT 1),
    (SELECT cm.user_id FROM chama_members cm WHERE cm.chama_id = c.id AND cm.role = 'secretary' LIMIT 1),
    'Meeting held successfully. All members present. Contributions collected. Two loan applications approved.',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
FROM chamas c
WHERE c.status = 'active';

-- ============================================================================
-- SAMPLE GOALS
-- ============================================================================

-- Create sample goals for each chama
INSERT INTO goals (
    chama_id, title, description, goal_type, category,
    target_amount, current_amount, target_date,
    status, created_by
)
SELECT 
    c.id,
    CASE c.category
        WHEN 'savings' THEN 'Emergency Fund Target'
        WHEN 'investment' THEN 'Investment Portfolio Growth'
        WHEN 'credit' THEN 'Loan Fund Expansion'
        ELSE 'General Savings Goal'
    END,
    CASE c.category
        WHEN 'savings' THEN 'Build emergency fund to support members during difficult times'
        WHEN 'investment' THEN 'Grow investment portfolio for better returns'
        WHEN 'credit' THEN 'Expand loan fund to serve more members'
        ELSE 'General savings and wealth building goal'
    END,
    c.category,
    'financial',
    CASE c.category
        WHEN 'savings' THEN 500000.00
        WHEN 'investment' THEN 1000000.00
        WHEN 'credit' THEN 750000.00
        ELSE 600000.00
    END,
    CASE c.category
        WHEN 'savings' THEN 250000.00
        WHEN 'investment' THEN 450000.00
        WHEN 'credit' THEN 320000.00
        ELSE 280000.00
    END,
    CURRENT_DATE + INTERVAL '12 months',
    'active',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
FROM chamas c
WHERE c.status = 'active';

-- ============================================================================
-- SAMPLE NOTIFICATIONS
-- ============================================================================

-- Create sample notifications for users
INSERT INTO notifications (
    chama_id, user_id, title, message, notification_type,
    category, channels, priority, status,
    related_entity_type, created_by
)
SELECT 
    cm.chama_id,
    cm.user_id,
    'Contribution Reminder',
    'Your monthly contribution of KES ' || c.min_contribution_amount || ' is due in 3 days.',
    'reminder',
    'contributions',
    '["app", "email", "sms"]'::jsonb,
    'normal',
    'pending',
    'contribution',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
FROM chama_members cm
JOIN chamas c ON cm.chama_id = c.id
WHERE cm.status = 'active'
  AND RANDOM() < 0.7; -- 70% of members get notifications

-- Create meeting reminder notifications
INSERT INTO notifications (
    chama_id, user_id, title, message, notification_type,
    category, channels, priority, status,
    related_entity_type, created_by
)
SELECT 
    cm.chama_id,
    cm.user_id,
    'Meeting Reminder',
    'Upcoming ' || c.name || ' meeting on ' || TO_CHAR(CURRENT_DATE + INTERVAL '1 week', 'Day, DD Month YYYY') || ' at ' || c.meeting_time,
    'reminder',
    'meetings',
    '["app", "email"]'::jsonb,
    'normal',
    'pending',
    'meeting',
    (SELECT id FROM users WHERE email = 'admin@moneypool.com')
FROM chama_members cm
JOIN chamas c ON cm.chama_id = c.id
WHERE cm.status = 'active';

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=====================================';
    RAISE NOTICE 'Sample Data Insert Complete!';
    RAISE NOTICE '=====================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Created sample data for:';
    RAISE NOTICE '- % chamas', (SELECT COUNT(*) FROM chamas WHERE created_by IS NOT NULL);
    RAISE NOTICE '- % users', (SELECT COUNT(*) FROM users WHERE email != 'admin@moneypool.com');
    RAISE NOTICE '- % memberships', (SELECT COUNT(*) FROM chama_members);
    RAISE NOTICE '- % transactions', (SELECT COUNT(*) FROM transactions);
    RAISE NOTICE '- % contributions', (SELECT COUNT(*) FROM contributions);
    RAISE NOTICE '- % loans', (SELECT COUNT(*) FROM loans);
    RAISE NOTICE '- % meetings', (SELECT COUNT(*) FROM meetings);
    RAISE NOTICE '- % goals', (SELECT COUNT(*) FROM goals);
    RAISE NOTICE '- % notifications', (SELECT COUNT(*) FROM notifications);
    RAISE NOTICE '';
    RAISE NOTICE 'Sample user credentials:';
    RAISE NOTICE 'All users: password123 (bcrypt hashed)';
    RAISE NOTICE '';
END $$;
