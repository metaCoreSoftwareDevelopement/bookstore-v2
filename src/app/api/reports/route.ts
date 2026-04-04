import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // Format: YYYY-MM-DD

    if (!date) return NextResponse.json({ error: 'Date required' }, { status: 400 });

    // Handle different incoming date formats just in case
    const dateParts = date.split('-');
    if (dateParts.length !== 3) return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    
    const [year, month, day] = dateParts;
    // Normalized DD-MM-YYYY (no leading zeros if they are missing in storage, but we pad for consistency)
    const dStr = `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
    const dStrNoZeroDay = `${parseInt(day)}-${month.padStart(2, '0')}-${year}`;
    const dStrNoZeroBoth = `${parseInt(day)}-${parseInt(month)}-${year}`;

    // Fetch invoices (simplified query)
    const { data: invoices, error } = await supabase
      .from('invoice')
      .select('*');

    if (error) throw error;

    // Fetch all student names for these invoices
    const rids = Array.from(new Set(invoices.map(i => i.rid)));
    const { data: students } = await supabase
      .from('student')
      .select('rid, name, class')
      .in('rid', rids);

    const studentMap = (students || []).reduce((acc: any, s: any) => {
      acc[s.rid] = { name: s.name, class: s.class };
      return acc;
    }, {});

    const report: any[] = [];

    (invoices ?? []).forEach((item: any) => {
      let bill;
      try {
        bill = typeof item.bill_json === 'string' ? JSON.parse(item.bill_json) : item.bill_json;
      } catch (e) {
        return;
      }
      
      if (!bill || !bill.Bill) return;

      // Find payments matching ANY of the common date formats
      const todayPayments = bill.Bill.filter((entry: any) => {
        const eDate = String(entry.Date);
        return eDate === dStr || eDate === dStrNoZeroDay || eDate === dStrNoZeroBoth || eDate === date;
      });

      if (todayPayments.length > 0) {
        todayPayments.forEach((entry: any) => {
          // Find the overall index of this specific payment in the full Bill history
          const installmentIndex = bill.Bill.indexOf(entry) + 1;
          const isFirstOfToday = todayPayments.indexOf(entry) === 0;

          report.push({
            InvoiceID: item.invoice_id,
            RID: item.rid,
            Date: dStr,
            StudentName: studentMap[item.rid]?.name || 'Unknown',
            Class: studentMap[item.rid]?.class || '-',
            // Only provide Total/Paid/Due on the first row of today's installments for this bill
            // to avoid double-counting in report footers.
            Total: isFirstOfToday ? Number(bill.Total || 0) : 0,
            Paid: isFirstOfToday ? Number(bill.Paid || 0) : 0,
            Due: isFirstOfToday ? Number(bill.Due || 0) : 0,
            Installments: `Inst. ${installmentIndex}`, 
            TodayPayment: Number(entry.ammount || 0),
          });
        });
      }
      // If no payments but invoice was created today, show it with 0 collection
      else if (item.date === date) {
        report.push({
          InvoiceID: item.invoice_id,
          RID: item.rid,
          Date: dStr,
          StudentName: studentMap[item.rid]?.name || 'Unknown',
          Class: studentMap[item.rid]?.class || '-',
          Total: Number(bill.Total || 0),
          Paid: Number(bill.Paid || 0),
          Due: Number(bill.Due || 0),
          Installments: bill.Bill.length,
          TodayPayment: 0,
        });
      }
    });

    return NextResponse.json({ data: report });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
