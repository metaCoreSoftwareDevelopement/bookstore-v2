import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

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
