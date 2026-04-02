import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wsyldsibfeyyxzzjnswr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzeWxkc2liZmV5eXh6empuc3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDM3MDMsImV4cCI6MjA5MDUxOTcwM30.C4E2KmPRgxBse-CwKCP8ASFlw5swI7CifAMRzYyG-Fw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Student {
  rid: string;
  name: string;
  class: string;
  phone_number: string;
  combinations: string;
}

export interface Combination {
  class: string;
  combinations: string;
  price: number;
}

export interface Invoice {
  invoice_id: string;
  rid: string;
  date: string;
  bill_json: BillJSON;
}

export interface BillJSON {
  Bill: PaymentEntry[];
  Total: number;
  Paid: number;
  Due: number;
}

export interface PaymentEntry {
  Date: string;
  ammount: number;
}

export interface StudentWithCombination extends Student {
  price: number;
}

export interface InvoiceWithStudent extends Invoice {
  name: string;
}
