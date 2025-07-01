/*
  # Enable RLS and add policies for equipment_items table

  1. Security
    - Enable RLS on `equipment_items` table
    - Add policy for authenticated users to read all equipment items
*/

ALTER TABLE equipment_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view equipment items"
  ON equipment_items
  FOR SELECT
  TO authenticated
  USING (true);