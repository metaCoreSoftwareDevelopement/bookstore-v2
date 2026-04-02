import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { rid } = body;

  if (!rid) return NextResponse.json({ error: 'RID is required' }, { status: 400 });

  const { data: student, error: sErr } = await supabase
    .from('student')
    .select('rid, name, class, phone_number, combinations')
    .eq('rid', rid)
    .single();

  if (sErr || !student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

  const { data: combo } = await supabase
    .from('combinations')
    .select('price')
    .eq('class', student.class)
    .eq('combinations', student.combinations)
    .single();

  const { data: invoices, error: iErr } = await supabase
    .from('invoice')
    .select('*')
    .eq('rid', rid)
    .order('date', { ascending: false });

  if (iErr) {
    console.error('Invoice Search Error:', iErr);
  }

  const invoice = invoices && invoices.length > 0 ? invoices[0] : null;

  const { data: allInvoices } = await supabase
    .from('invoice')
    .select('invoice_id');

  let maxId = 0;
  (allInvoices ?? []).forEach(inv => {
    const num = parseInt(inv.invoice_id.replace('RPB', ''));
    if (!isNaN(num) && num > maxId) maxId = num;
  });

  const newInvoiceId = `RPB${maxId + 1}`;

  if (invoice && typeof invoice.bill_json === 'string') {
    try {
      invoice.bill_json = JSON.parse(invoice.bill_json);
    } catch (e) {
      invoice.bill_json = { Bill: [], Total: 0, Paid: 0, Due: 0 };
    }
  }

  return NextResponse.json({
    student: { ...student, price: combo?.price ?? 0 },
    invoice: invoice ?? null,
    newInvoiceId,
  });
}
