import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const { data, error } = await supabase
    .from('invoice')
    .select('invoice_id, rid, bill_json');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch names separately for each invoice
  const withNames = await Promise.all(
    (data ?? []).map(async (item) => {
      const { data: s } = await supabase
        .from('student')
        .select('name')
        .eq('rid', item.rid)
        .single();
      let bill;
      try {
        bill = typeof item.bill_json === 'string' ? JSON.parse(item.bill_json) : item.bill_json;
      } catch (e) {
        bill = { Total: 0, Paid: 0, Due: 0 };
      }

      return {
        Rid: item.rid,
        Name: s?.name ?? '—',
        Total: bill.Total,
        Paid: bill.Paid,
        Due: bill.Due,
      };
    })
  );

  const dues = withNames.filter((item) => Number(item.Due) > 0);
  return NextResponse.json({ data: dues });
}
