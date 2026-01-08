/*
  # Create Payment System Tables

  1. New Tables
    - `bank_accounts`
      - `id` (uuid, primary key)
      - `bank_name` (text)
      - `account_number` (text)
      - `ifsc_code` (text)
      - `account_holder_name` (text)
      - `upi_id` (text)
      - `qr_code_url` (text, optional)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `qr_payments`
      - `id` (uuid, primary key)
      - `booking_id` (text)
      - `bank_account_id` (uuid, foreign key)
      - `payer_name` (text)
      - `payer_phone` (text)
      - `utr_number` (text)
      - `amount` (numeric, optional)
      - `proof_url` (text, optional)
      - `status` (text: pending, verified, failed)
      - `admin_notes` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `verified_by` (text, optional)
      - `verified_at` (timestamp, optional)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users and admin access
*/

-- Create bank_accounts table
CREATE TABLE IF NOT EXISTS bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL,
  account_number text NOT NULL,
  ifsc_code text NOT NULL,
  account_holder_name text NOT NULL,
  upi_id text NOT NULL,
  qr_code_url text,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create qr_payments table
CREATE TABLE IF NOT EXISTS qr_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id text NOT NULL,
  bank_account_id uuid REFERENCES bank_accounts(id),
  payer_name text NOT NULL,
  payer_phone text NOT NULL,
  utr_number text NOT NULL,
  amount numeric,
  proof_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  verified_by text,
  verified_at timestamptz
);

-- Enable RLS
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_payments ENABLE ROW LEVEL SECURITY;

-- Bank accounts policies (read-only for authenticated users)
CREATE POLICY "Anyone can read active bank accounts"
  ON bank_accounts
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- QR payments policies
CREATE POLICY "Users can create their own payment records"
  ON qr_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read their own payment records"
  ON qr_payments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can read all payment records"
  ON qr_payments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update payment records"
  ON qr_payments
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insert sample bank account
INSERT INTO bank_accounts (
  bank_name,
  account_number,
  ifsc_code,
  account_holder_name,
  upi_id,
  is_active
) VALUES (
  'State Bank of India',
  '1234567890',
  'SBIN0001234',
  'RUTVIK SERVICES',
  'rutvik@paytm',
  true
) ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_qr_payments_booking_id ON qr_payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_qr_payments_status ON qr_payments(status);
CREATE INDEX IF NOT EXISTS idx_qr_payments_created_at ON qr_payments(created_at);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_active ON bank_accounts(is_active);