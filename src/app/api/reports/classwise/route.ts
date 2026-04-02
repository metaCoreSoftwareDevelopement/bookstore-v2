import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Fetch all students
    const { data: students, error: studentError } = await supabase
      .from('student')
      .select('rid, name, class');

    if (studentError) throw studentError;

    // 2. Fetch all invoices
    const { data: invoices, error: invoiceError } = await supabase
      .from('invoice')
      .select('rid, bill_json');

    if (invoiceError) throw invoiceError;

    // 3. Create a map for quick invoice lookup by RID
    const invoiceMap: Record<string, any> = {};
    invoices.forEach((inv) => {
      invoiceMap[inv.rid] = inv.bill_json;
    });

    // 4. Group and aggregate data by Class AND Branch (Iterating over ALL students)
    const classStats: Record<string, { 
      class: string; 
      count: number; 
      pendingBills: number; 
      total: number; 
      paid: number; 
      due: number; 
      students: any[] 
    }> = {};

    students.forEach((student) => {
      const studentClass = student.class || 'Unknown';
      const rid = String(student.rid).toUpperCase();
      
      // Determine Branch from RID
      let branch = 'Other';
      if (rid.includes('BUR')) branch = 'Burdwan';
      else if (rid.includes('S')) branch = 'Sodepur';
      else if (rid.includes('B')) branch = 'Belgharia';

      if (!classStats[studentClass]) {
        classStats[studentClass] = { 
          class: studentClass, 
          count: 0, 
          pendingBills: 0, 
          total: 0, 
          paid: 0, 
          due: 0, 
          students: [] 
        };
      }

      const stats = classStats[studentClass];
      const billJSON = invoiceMap[student.rid];

      if (billJSON) {
        // Bill Generated
        let bill;
        try {
          bill = typeof billJSON === 'string' ? JSON.parse(billJSON) : billJSON;
        } catch (e) {
          bill = { Total: 0, Paid: 0, Due: 0 };
        }

        stats.count += 1;
        stats.total += Number(bill.Total || 0);
        stats.paid += Number(bill.Paid || 0);
        stats.due += Number(bill.Due || 0);

        stats.students.push({
          rid: student.rid,
          name: student.name,
          branch: branch,
          total: Number(bill.Total || 0),
          paid: Number(bill.Paid || 0),
          due: Number(bill.Due || 0),
          status: Number(bill.Due) > 0 ? 'Due' : 'Paid'
        });
      } else {
        // Bill NOT Generated
        stats.pendingBills += 1;
        stats.students.push({
          rid: student.rid,
          name: student.name,
          branch: branch,
          total: 0,
          paid: 0,
          due: 0,
          status: 'Not Generated'
        });
      }
    });

    // 5. Sort classes and internal students
    const result = Object.values(classStats).map(c => ({
      ...c,
      students: c.students.sort((a, b) => {
        // Sort by status (Generated first) then by name
        if (a.status === 'Not Generated' && b.status !== 'Not Generated') return 1;
        if (a.status !== 'Not Generated' && b.status === 'Not Generated') return -1;
        return a.name.localeCompare(b.name);
      })
    })).sort((a, b) => a.class.localeCompare(b.class));

    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
