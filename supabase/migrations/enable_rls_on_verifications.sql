/*
  # Enable RLS and add policies for verifications table

  1. New Tables (if not exists)
    - `verifications` (assuming it exists or will be created)
      - `id` (uuid, primary key)
      - `equipment_item_id` (uuid, foreign key to equipment_items)
      - `verification_type` (text)
      - `scheduled_date` (timestamptz)
      - `assigned_to` (uuid, foreign key to firefighters)
      - `priority` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `verifications` table
    - Add policies for authenticated users to perform CRUD operations on verifications
*/

-- Ensure the verifications table exists (if not already created)
CREATE TABLE IF NOT EXISTS verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_item_id uuid REFERENCES equipment_items(id) ON DELETE CASCADE NOT NULL,
  verification_type text NOT NULL,
  scheduled_date timestamptz NOT NULL,
  assigned_to uuid REFERENCES firefighters(id) ON DELETE SET NULL,
  priority text DEFAULT 'Normale' NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view verifications"
  ON verifications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create verifications"
  ON verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update verifications"
  ON verifications
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete verifications"
  ON verifications
  FOR DELETE
  TO authenticated
  USING (true);