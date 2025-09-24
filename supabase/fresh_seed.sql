-- Easy Charge Pro - Database Schema and RLS Setup
-- This file sets up the required tables and Row Level Security policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USER PROFILES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    address TEXT,
    default_currency TEXT DEFAULT 'USD',
    default_tax_rate NUMERIC DEFAULT 10.00,
    invoice_prefix TEXT DEFAULT 'INV',
    bank_name TEXT,
    account_number TEXT,
    swift_code TEXT,
    iban TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- CLIENTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    email VARCHAR,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- INVOICES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    invoice_number VARCHAR NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    currency VARCHAR DEFAULT 'USD',
    is_recurring BOOLEAN DEFAULT false,
    recurring_interval VARCHAR CHECK (recurring_interval IN ('weekly', 'monthly', 'quarterly', 'yearly')),
    business_name VARCHAR,
    business_email VARCHAR,
    business_phone VARCHAR,
    business_address TEXT,
    business_logo_url TEXT,
    client_name VARCHAR,
    client_email VARCHAR,
    client_address TEXT,
    bank_name VARCHAR,
    account_number VARCHAR,
    swift_code VARCHAR,
    iban VARCHAR,
    line_items JSONB DEFAULT '[]',
    tax_rate NUMERIC DEFAULT 0,
    discount_rate NUMERIC DEFAULT 0,
    subtotal NUMERIC DEFAULT 0,
    tax_amount NUMERIC DEFAULT 0,
    discount_amount NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    notes TEXT,
    template VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    email_sent_date TIMESTAMPTZ
);

-- =============================================
-- INVOICE ITEMS TABLE (Alternative to JSONB line_items)
-- =============================================

CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    unit_price NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USER PROFILES RLS POLICIES
-- =============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- CLIENTS RLS POLICIES
-- =============================================

-- Users can view their own clients
CREATE POLICY "Users can view their own clients" ON clients
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own clients
CREATE POLICY "Users can insert their own clients" ON clients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own clients
CREATE POLICY "Users can update their own clients" ON clients
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own clients
CREATE POLICY "Users can delete their own clients" ON clients
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- INVOICES RLS POLICIES
-- =============================================

-- Users can view their own invoices
CREATE POLICY "Users can view their own invoices" ON invoices
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own invoices
CREATE POLICY "Users can insert their own invoices" ON invoices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own invoices
CREATE POLICY "Users can update their own invoices" ON invoices
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own invoices
CREATE POLICY "Users can delete their own invoices" ON invoices
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- INVOICE ITEMS RLS POLICIES
-- =============================================

-- Users can view items for their own invoices
CREATE POLICY "Users can view items for their own invoices" ON invoice_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    );

-- Users can insert items for their own invoices
CREATE POLICY "Users can insert items for their own invoices" ON invoice_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    );

-- Users can update items for their own invoices
CREATE POLICY "Users can update items for their own invoices" ON invoice_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    );

-- Users can delete items for their own invoices
CREATE POLICY "Users can delete items for their own invoices" ON invoice_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    );

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Indexes for clients
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);

-- Indexes for invoices
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

-- Indexes for invoice_items
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at 
    BEFORE UPDATE ON invoices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

-- This script has successfully created:
-- ✅ user_profiles table with RLS
-- ✅ clients table with RLS  
-- ✅ invoices table with RLS
-- ✅ invoice_items table with RLS
-- ✅ All necessary indexes for performance
-- ✅ Updated_at triggers for all tables
-- ✅ Complete Row Level Security policies

-- Next steps:
-- 1. Create users in Supabase Auth
-- 2. Run sample_data_seed.sql for test data (optional)
-- 3. Start using the application!
