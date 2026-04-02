import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { invoiceId, rid, total, paid, due } = body;

  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const dateStr = `${day}-${month}-${year}`;
  const sqlDate = `${year}-${month}-${day}`;

  const billJson = {
    Bill: [{ Date: dateStr, ammount: Number(paid) }],
    Total: Number(total),
    Paid: Number(paid),
    Due: Number(due),
  };

  // Check if invoice already exists for this RID
  const { data: existing } = await supabase.from('invoice').select('invoice_id').eq('rid', rid).single();
  if (existing) {
    return NextResponse.json({ error: `Invoice already exists for student ${rid} (ID: ${existing.invoice_id})` }, { status: 400 });
  }

  const { error } = await supabase.from('invoice').insert({
    invoice_id: invoiceId,
    rid: String(rid),
    date: sqlDate,
    bill_json: JSON.stringify(billJson), // Store as string for TEXT column
  });

  if (error) {
    console.error('Invoice Save Error:', error);
    return NextResponse.json({ error: error.message || 'Unknown database error' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
