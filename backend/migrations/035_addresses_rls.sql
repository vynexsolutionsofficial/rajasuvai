-- Migration: Add RLS policies for addresses table
-- Run this in the Supabase SQL Editor

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Select Addresses" ON addresses FOR SELECT USING (true);
CREATE POLICY "Public Insert Addresses" ON addresses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Addresses" ON addresses FOR UPDATE USING (true);
CREATE POLICY "Public Delete Addresses" ON addresses FOR DELETE USING (true);
