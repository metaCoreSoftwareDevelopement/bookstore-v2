import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { rid, newPayment } = body;

  // Fetch current invoice
  const { data: invoice, error: fetchError } = await supabase
    .from('invoice')
    .select('*')
    .eq('rid', rid)
    .single();

  if (fetchError || !invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const dateStr = `${day}-${month}-${year}`;

  let billJson;
  try {
    billJson = typeof invoice.bill_json === 'string' ? JSON.parse(invoice.bill_json) : invoice.bill_json;
  } catch (e) {
    return NextResponse.json({ error: 'Invalid bill JSON format' }, { status: 400 });
  }

  billJson.Bill.push({ Date: dateStr, ammount: Number(newPayment) });

  // Recalculate totals
  let totalPaid = 0;
  billJson.Bill.forEach((item: { ammount: number | string }) => {
    totalPaid += Number(item.ammount);
  });
  billJson.Paid = totalPaid;
  billJson.Due = Number(billJson.Total) - totalPaid;

  const updatePayload = typeof invoice.bill_json === 'string' ? JSON.stringify(billJson) : billJson;

  const { error: updateError } = await supabase
    .from('invoice')
    .update({ bill_json: updatePayload })
    .eq('rid', rid);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, billJson, invoiceId: invoice.invoice_id });
}
