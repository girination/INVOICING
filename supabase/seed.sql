-- Simple Invoicing Database Seed File
-- This file contains sample data for development and testing

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- SAMPLE USER PROFILES
-- =============================================

-- Insert sample user profiles (Note: These reference auth.users which must exist)
-- You'll need to create these users in the Supabase Auth dashboard first

-- Sample Profile 1: Complete Business Profile
INSERT INTO user_profiles (
    user_id,
    business_name,
    email,
    phone,
    website,
    address,
    default_currency,
    default_tax_rate,
    invoice_prefix,
    bank_name,
    account_number,
    swift_code,
    iban,
    logo_url,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid, -- Replace with actual user ID
    'Acme Corporation',
    'contact@acmecorp.com',
    '+1-555-0123',
    'https://www.acmecorp.com',
    '123 Business Street\nSuite 100\nNew York, NY 10001',
    'USD',
    8.5,
    'ACME',
    'First National Bank',
    '1234567890',
    'FNBKUS33',
    'US64SVBKUS6S3300958879',
    'https://example.com/logos/acme-logo.png',
    NOW(),
    NOW()
);

-- Sample Profile 2: Minimal Profile
INSERT INTO user_profiles (
    user_id,
    business_name,
    email,
    phone,
    address,
    default_currency,
    default_tax_rate,
    invoice_prefix,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000002'::uuid, -- Replace with actual user ID
    'Freelance Design Co',
    'hello@freelancedesign.com',
    '+1-555-0456',
    '456 Creative Lane\nLos Angeles, CA 90210',
    'USD',
    10.0,
    'FD',
    NOW(),
    NOW()
);

-- Sample Profile 3: International Business
INSERT INTO user_profiles (
    user_id,
    business_name,
    email,
    phone,
    website,
    address,
    default_currency,
    default_tax_rate,
    invoice_prefix,
    bank_name,
    account_number,
    swift_code,
    iban,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000003'::uuid, -- Replace with actual user ID
    'Global Tech Solutions',
    'info@globaltech.com',
    '+44-20-7946-0958',
    'https://www.globaltech.com',
    '789 Innovation Drive\nLondon, UK SW1A 1AA',
    'GBP',
    20.0,
    'GTS',
    'Barclays Bank',
    '9876543210',
    'BARCGB22',
    'GB29BARC20040179470288',
    NOW(),
    NOW()
);

-- =============================================
-- SAMPLE CLIENTS
-- =============================================

-- Clients for User 1 (Acme Corporation)
INSERT INTO clients (
    user_id,
    name,
    email,
    address,
    created_at,
    updated_at
) VALUES 
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'TechStart Inc',
    'billing@techstart.com',
    '100 Startup Avenue\nSan Francisco, CA 94105',
    NOW(),
    NOW()
),
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Marketing Pro LLC',
    'accounts@marketingpro.com',
    '200 Marketing Street\nChicago, IL 60601',
    NOW(),
    NOW()
),
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Retail Solutions Ltd',
    'finance@retailsolutions.com',
    '300 Commerce Blvd\nMiami, FL 33101',
    NOW(),
    NOW()
);

-- Clients for User 2 (Freelance Design Co)
INSERT INTO clients (
    user_id,
    name,
    email,
    address,
    created_at,
    updated_at
) VALUES 
(
    '00000000-0000-0000-0000-000000000002'::uuid,
    'Local Restaurant',
    'owner@localrestaurant.com',
    '500 Main Street\nPortland, OR 97201',
    NOW(),
    NOW()
),
(
    '00000000-0000-0000-0000-000000000002'::uuid,
    'Fitness Studio',
    'manager@fitnessstudio.com',
    '600 Health Way\nSeattle, WA 98101',
    NOW(),
    NOW()
);

-- Clients for User 3 (Global Tech Solutions)
INSERT INTO clients (
    user_id,
    name,
    email,
    address,
    created_at,
    updated_at
) VALUES 
(
    '00000000-0000-0000-0000-000000000003'::uuid,
    'European Manufacturing',
    'procurement@euromfg.com',
    '400 Industrial Park\nBerlin, Germany 10115',
    NOW(),
    NOW()
),
(
    '00000000-0000-0000-0000-000000000003'::uuid,
    'Asia Pacific Corp',
    'finance@asiapacific.com',
    '700 Business District\nTokyo, Japan 100-0001',
    NOW(),
    NOW()
);

-- =============================================
-- SAMPLE INVOICES
-- =============================================

-- Invoices for User 1 (Acme Corporation)
INSERT INTO invoices (
    user_id,
    invoice_number,
    issue_date,
    due_date,
    currency,
    is_recurring,
    recurring_interval,
    business_name,
    business_email,
    business_phone,
    business_address,
    business_logo_url,
    client_name,
    client_email,
    client_address,
    bank_name,
    account_number,
    swift_code,
    iban,
    line_items,
    tax_rate,
    discount_rate,
    subtotal,
    tax_amount,
    discount_amount,
    total,
    notes,
    template,
    created_at,
    updated_at,
    email_sent_date
) VALUES 
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'ACME-2024-001',
    '2024-01-15',
    '2024-02-15',
    'USD',
    false,
    null,
    'Acme Corporation',
    'contact@acmecorp.com',
    '+1-555-0123',
    '123 Business Street, Suite 100, New York, NY 10001',
    'https://example.com/logos/acme-logo.png',
    'TechStart Inc',
    'billing@techstart.com',
    '100 Startup Avenue, San Francisco, CA 94105',
    'First National Bank',
    '1234567890',
    'FNBKUS33',
    'US64SVBKUS6S3300958879',
    '[
        {
            "id": "1",
            "description": "Software Development Services",
            "quantity": 40,
            "rate": 150.00,
            "amount": 6000.00
        },
        {
            "id": "2", 
            "description": "Project Management",
            "quantity": 20,
            "rate": 100.00,
            "amount": 2000.00
        }
    ]'::jsonb,
    8.5,
    0,
    8000.00,
    680.00,
    0,
    8680.00,
    'Thank you for your business! Payment is due within 30 days.',
    'modern',
    NOW(),
    NOW(),
    '2024-01-16 10:30:00+00'::timestamptz
),
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'ACME-2024-002',
    '2024-01-20',
    '2024-02-20',
    'USD',
    true,
    'monthly',
    'Acme Corporation',
    'contact@acmecorp.com',
    '+1-555-0123',
    '123 Business Street, Suite 100, New York, NY 10001',
    'https://example.com/logos/acme-logo.png',
    'Marketing Pro LLC',
    'accounts@marketingpro.com',
    '200 Marketing Street, Chicago, IL 60601',
    'First National Bank',
    '1234567890',
    'FNBKUS33',
    'US64SVBKUS6S3300958879',
    '[
        {
            "id": "1",
            "description": "Monthly Marketing Services",
            "quantity": 1,
            "rate": 2500.00,
            "amount": 2500.00
        }
    ]'::jsonb,
    8.5,
    5,
    2500.00,
    212.50,
    125.00,
    2587.50,
    'Recurring monthly marketing services. Next invoice will be generated automatically.',
    'corporate',
    NOW(),
    NOW(),
    null
);

-- Invoices for User 2 (Freelance Design Co)
INSERT INTO invoices (
    user_id,
    invoice_number,
    issue_date,
    due_date,
    currency,
    is_recurring,
    recurring_interval,
    business_name,
    business_email,
    business_phone,
    business_address,
    client_name,
    client_email,
    client_address,
    line_items,
    tax_rate,
    discount_rate,
    subtotal,
    tax_amount,
    discount_amount,
    total,
    notes,
    template,
    created_at,
    updated_at
) VALUES 
(
    '00000000-0000-0000-0000-000000000002'::uuid,
    'FD-2024-001',
    '2024-01-10',
    '2024-01-25',
    'USD',
    false,
    null,
    'Freelance Design Co',
    'hello@freelancedesign.com',
    '+1-555-0456',
    '456 Creative Lane, Los Angeles, CA 90210',
    'Local Restaurant',
    'owner@localrestaurant.com',
    '500 Main Street, Portland, OR 97201',
    '[
        {
            "id": "1",
            "description": "Logo Design",
            "quantity": 1,
            "rate": 500.00,
            "amount": 500.00
        },
        {
            "id": "2",
            "description": "Menu Design",
            "quantity": 1,
            "rate": 300.00,
            "amount": 300.00
        }
    ]'::jsonb,
    10.0,
    0,
    800.00,
    80.00,
    0,
    880.00,
    'Design work completed. Thank you!',
    'creative',
    NOW(),
    NOW()
);

-- Invoices for User 3 (Global Tech Solutions)
INSERT INTO invoices (
    user_id,
    invoice_number,
    issue_date,
    due_date,
    currency,
    is_recurring,
    recurring_interval,
    business_name,
    business_email,
    business_phone,
    business_address,
    client_name,
    client_email,
    client_address,
    bank_name,
    account_number,
    swift_code,
    iban,
    line_items,
    tax_rate,
    discount_rate,
    subtotal,
    tax_amount,
    discount_amount,
    total,
    notes,
    template,
    created_at,
    updated_at
) VALUES 
(
    '00000000-0000-0000-0000-000000000003'::uuid,
    'GTS-2024-001',
    '2024-01-12',
    '2024-02-12',
    'GBP',
    false,
    null,
    'Global Tech Solutions',
    'info@globaltech.com',
    '+44-20-7946-0958',
    '789 Innovation Drive, London, UK SW1A 1AA',
    'European Manufacturing',
    'procurement@euromfg.com',
    '400 Industrial Park, Berlin, Germany 10115',
    'Barclays Bank',
    '9876543210',
    'BARCGB22',
    'GB29BARC20040179470288',
    '[
        {
            "id": "1",
            "description": "System Integration Services",
            "quantity": 80,
            "rate": 75.00,
            "amount": 6000.00
        },
        {
            "id": "2",
            "description": "Technical Consulting",
            "quantity": 16,
            "rate": 125.00,
            "amount": 2000.00
        }
    ]'::jsonb,
    20.0,
    0,
    8000.00,
    1600.00,
    0,
    9600.00,
    'International project completed successfully. Wire transfer preferred.',
    'classic',
    NOW(),
    NOW()
);

-- =============================================
-- ADDITIONAL SAMPLE DATA
-- =============================================

-- Add more clients for variety
INSERT INTO clients (
    user_id,
    name,
    email,
    address,
    created_at,
    updated_at
) VALUES 
-- More clients for User 1
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Consulting Firm',
    'billing@consultingfirm.com',
    '400 Professional Plaza\nBoston, MA 02101',
    NOW(),
    NOW()
),
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'E-commerce Store',
    'finance@ecommercestore.com',
    '500 Digital Drive\nAustin, TX 78701',
    NOW(),
    NOW()
),
-- More clients for User 2
(
    '00000000-0000-0000-0000-000000000002'::uuid,
    'Non-Profit Organization',
    'admin@nonprofit.org',
    '700 Charity Street\nDenver, CO 80201',
    NOW(),
    NOW()
),
-- More clients for User 3
(
    '00000000-0000-0000-0000-000000000003'::uuid,
    'Financial Services',
    'accounts@financialservices.com',
    '800 Money Lane\nZurich, Switzerland 8001',
    NOW(),
    NOW()
);

-- Add more sample invoices
INSERT INTO invoices (
    user_id,
    invoice_number,
    issue_date,
    due_date,
    currency,
    is_recurring,
    recurring_interval,
    business_name,
    business_email,
    business_phone,
    business_address,
    business_logo_url,
    client_name,
    client_email,
    client_address,
    bank_name,
    account_number,
    swift_code,
    iban,
    line_items,
    tax_rate,
    discount_rate,
    subtotal,
    tax_amount,
    discount_amount,
    total,
    notes,
    template,
    created_at,
    updated_at,
    email_sent_date
) VALUES 
-- Another invoice for User 1
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'ACME-2024-003',
    '2024-01-25',
    '2024-02-25',
    'USD',
    false,
    null,
    'Acme Corporation',
    'contact@acmecorp.com',
    '+1-555-0123',
    '123 Business Street, Suite 100, New York, NY 10001',
    'https://example.com/logos/acme-logo.png',
    'Consulting Firm',
    'billing@consultingfirm.com',
    '400 Professional Plaza, Boston, MA 02101',
    'First National Bank',
    '1234567890',
    'FNBKUS33',
    'US64SVBKUS6S3300958879',
    '[
        {
            "id": "1",
            "description": "Strategic Consulting",
            "quantity": 25,
            "rate": 200.00,
            "amount": 5000.00
        },
        {
            "id": "2",
            "description": "Market Research",
            "quantity": 1,
            "rate": 1500.00,
            "amount": 1500.00
        }
    ]'::jsonb,
    8.5,
    10,
    6500.00,
    552.50,
    650.00,
    6402.50,
    'Strategic consulting project completed. Thank you for your partnership.',
    'minimal',
    NOW(),
    NOW(),
    '2024-01-26 14:15:00+00'::timestamptz
);

-- =============================================
-- USAGE INSTRUCTIONS
-- =============================================

/*
IMPORTANT: Before running this seed file, you need to:

1. Create users in Supabase Auth dashboard or via API
2. Replace the placeholder UUIDs (00000000-0000-0000-0000-000000000001, etc.) 
   with actual user IDs from your auth.users table
3. Update logo URLs to point to actual image files
4. Adjust business information to match your test scenarios

To get actual user IDs, run:
SELECT id, email FROM auth.users;

Then update the seed file with real user IDs.

This seed file provides:
- 3 sample user profiles with different business types
- 8 sample clients across different users
- 5 sample invoices with various templates and scenarios
- Mix of one-time and recurring invoices
- Different currencies (USD, GBP)
- Various business scenarios (tech, design, consulting, etc.)
- Realistic line items and calculations
- Email sent dates for some invoices

The data is designed to showcase:
- Different invoice templates (modern, corporate, creative, classic, minimal)
- Various business types and sizes
- International business scenarios
- Recurring vs one-time invoices
- Different tax rates and currencies
- Banking information for different regions
*/
