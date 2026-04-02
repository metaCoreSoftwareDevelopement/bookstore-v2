import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: invoices, error: invError } = await supabase.from('invoice').select('*').limit(5);
    const { data: students, error: stdError } = await supabase.from('student').select('*').limit(5);
    
    return NextResponse.json({
      invoices: invoices || [],
      students: students || [],
      invError: invError?.message || null,
      stdError: stdError?.message || null,
      currentTime: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
