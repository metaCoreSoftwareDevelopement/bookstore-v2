-- ===================================================
-- BookStore V2 - Supabase Schema (Complete Rewrite)
-- Run this ENTIRE script in Supabase SQL Editor
-- ===================================================

-- Drop existing tables if running fresh
DROP TABLE IF EXISTS invoice CASCADE;
DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS combinations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (for app authentication)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

INSERT INTO users (username, password) VALUES
  ('Supriyo', '12345'),
  ('test', 'test');

-- Combinations table (book sets + pricing)
CREATE TABLE combinations (
  class TEXT NOT NULL,
  combinations TEXT NOT NULL,
  price BIGINT NOT NULL,
  PRIMARY KEY (class, combinations)
);

INSERT INTO combinations (class, combinations, price) VALUES
  ('Ten', 'PCMB', 100000),
  ('Ten', 'PCMC', 95000),
  ('Nine', 'PCMB', 90000),
  ('Eight', 'General', 75000);

-- Student table (manual TEXT RID as primary key)
CREATE TABLE student (
  rid TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  combinations TEXT NOT NULL
);

-- Sample students
INSERT INTO student (rid, name, class, phone_number, combinations) VALUES
  ('1043', 'Ayush Singh', 'Ten', '1234567890', 'PCMB'),
  ('1234', 'Sinchan Nandy', 'Ten', '9163727078', 'PCMB');

-- Invoice table - uses JSONB for bill data (same structure as original)
-- bill_json format: {"Bill": [{"Date": "31-03-2024", "ammount": 5000}], "Total": 100000, "Paid": 5000, "Due": 95000}
CREATE TABLE invoice (
  invoice_id TEXT PRIMARY KEY,
  rid TEXT NOT NULL REFERENCES student(rid),
  date DATE DEFAULT CURRENT_DATE,
  bill_json TEXT NOT NULL DEFAULT '{"Bill":[],"Total":0,"Paid":0,"Due":0}'
);

-- Sample invoice
INSERT INTO invoice (invoice_id, rid, date, bill_json) VALUES
  ('RPB1', '1043', '2024-01-15', '{"Bill":[{"Date":"15-01-2024","ammount":50000},{"Date":"20-02-2024","ammount":20000}],"Total":100000,"Paid":70000,"Due":30000}'::jsonb),
  ('RPB2', '1234', '2024-02-03', '{"Bill":[{"Date":"03-02-2024","ammount":10000}],"Total":95000,"Paid":10000,"Due":85000}'::jsonb);

-- Disable RLS so anon key can access all tables (app handles its own auth)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE combinations DISABLE ROW LEVEL SECURITY;
ALTER TABLE student DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoice DISABLE ROW LEVEL SECURITY;
