/*
  # Daily Sales Tracker Schema

  1. New Tables
    - `sales`
      - `id` (uuid, primary key) - Unique identifier for each sale
      - `sale_date` (date, not null) - Date of the sale
      - `category` (text, not null) - Product category ('Tekstil' or 'Perde')
      - `product_name` (text, not null) - Name of the product sold
      - `payment_method` (text, not null) - Payment method ('Nakit', 'K.K.', 'IBAN', 'Mail Order')
      - `amount` (numeric, not null) - Sale amount
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `sales` table
    - Add policy for public access (for now, as this is a boutique shop app)
    
  3. Indexes
    - Index on `sale_date` for fast date-based queries
*/

CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_date date NOT NULL,
  category text NOT NULL CHECK (category IN ('Tekstil', 'Perde')),
  product_name text NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('Nakit', 'K.K.', 'IBAN', 'Mail Order')),
  amount numeric NOT NULL CHECK (amount > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sales_date_idx ON sales(sale_date DESC);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to sales"
  ON sales FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to sales"
  ON sales FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to sales"
  ON sales FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to sales"
  ON sales FOR DELETE
  TO anon
  USING (true);

-- Insert some mock data for testing
INSERT INTO sales (sale_date, category, product_name, payment_method, amount) VALUES
  (CURRENT_DATE, 'Tekstil', 'Erkek Gömlek', 'Nakit', 450),
  (CURRENT_DATE, 'Perde', 'Zebra Perde 2m', 'K.K.', 850),
  (CURRENT_DATE, 'Tekstil', 'Kadın Elbise', 'IBAN', 1200),
  (CURRENT_DATE - INTERVAL '1 day', 'Tekstil', 'Çocuk Tişört', 'Nakit', 150),
  (CURRENT_DATE - INTERVAL '1 day', 'Perde', 'Stor Perde', 'K.K.', 650),
  (CURRENT_DATE - INTERVAL '2 days', 'Tekstil', 'Pantolon', 'Mail Order', 380),
  (CURRENT_DATE - INTERVAL '2 days', 'Perde', 'Fon Perde', 'Nakit', 920);
