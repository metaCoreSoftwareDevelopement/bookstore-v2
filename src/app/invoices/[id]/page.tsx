"use client";

import { useState } from "react";
import { 
  Printer, 
  ArrowLeft, 
  Plus, 
  History, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

export default function InvoiceDetailsPage({ params }: { params: { id: string } }) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [newPayment, setNewPayment] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Mock data for the specific invoice
  const invoice = {
    id: params.id,
    invoice_number: "INV-2024-001",
    student: {
      name: "Ayush Singh",
      rid: "RID-1043",
      class: "Ten",
      phone: "1234567890",
      combinations: "PCMB"
    },
    total: 100000,
    paid: 50000,
    due: 50000,
    date: "2024-03-15",
    payments: [
      { date: "2024-03-15", amount: 20000 },
      { date: "2024-03-20", amount: 30000 },
    ]
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Action Header - Hidden on Print */}
      <div className="flex items-center justify-between no-print">
        <Link href="/invoices">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft size={16} />
            Back to Invoices
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handlePrint}>
            <Printer size={16} />
            Print Bill
          </Button>
          {invoice.due > 0 && (
            <Button className="gap-2" onClick={() => setShowPaymentForm(!showPaymentForm)}>
              <Plus size={16} />
              Add Payment
            </Button>
          )}
        </div>
      </div>

      {/* Payment Form - Hidden on Print */}
      {showPaymentForm && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="bg-card border rounded-xl p-6 shadow-sm no-print"
        >
          <h3 className="text-lg font-bold mb-4">Record New Payment</h3>
          <div className="flex items-end gap-4 max-w-md">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Amount (₹)</label>
              <input 
                type="number" 
                className="w-full p-2 bg-background border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                value={newPayment}
                onChange={(e) => setNewPayment(e.target.value)}
                placeholder="Enter amount..."
              />
            </div>
            <Button className="gap-2">
              <DollarSign size={16} />
              Submit Payment
            </Button>
          </div>
        </motion.div>
      )}

      {/* THE BILL - Modern View + Print Optimization */}
      <div className="bg-white text-black rounded-xl border shadow-xl p-8 md:p-12 max-w-4xl mx-auto overflow-hidden print:shadow-none print:border-none print:p-0">
        {/* Bill Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex flex-col gap-4">
             {/* Logo Placeholder */}
             <div className="w-24 h-24 bg-zinc-100 flex items-center justify-center rounded">
                <span className="font-bold text-zinc-400">LOGO</span>
             </div>
             <div className="space-y-1">
                <h2 className="text-xl font-bold">Geetanjali</h2>
                <p className="text-sm text-zinc-500">Thankurtala, Nimta, Kolkata</p>
                <p className="text-sm text-zinc-500">West Bengal 700049</p>
                <p className="text-sm text-zinc-500 font-medium">rabindrapathbhaban2003@gmail.com</p>
             </div>
          </div>
          <div className="text-right">
             <h1 className="text-3xl font-black tracking-tight text-zinc-900 mb-2 uppercase">Invoice</h1>
             <p className="text-sm font-mono font-bold text-zinc-500 uppercase">{invoice.invoice_number}</p>
             <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest">Date Issued</p>
                <p className="text-lg font-bold">{invoice.date}</p>
             </div>
          </div>
        </div>

        {/* Billing Info */}
        <div className="grid grid-cols-2 gap-12 py-8 border-y bg-zinc-50/50 -mx-8 px-12 md:-mx-12 mb-12">
           <div>
              <p className="text-[10px] text-zinc-400 uppercase font-black tracking-[0.2em] mb-4">Billed To</p>
              <h3 className="text-xl font-bold mb-2">{invoice.student.name}</h3>
              <div className="space-y-1 text-sm">
                 <p className="flex justify-between w-full max-w-[200px]">
                    <span className="text-zinc-500">RID:</span>
                    <span className="font-mono font-bold text-blue-600">{invoice.student.rid}</span>
                 </p>
                 <p className="flex justify-between w-full max-w-[200px]">
                    <span className="text-zinc-500">Class:</span>
                    <span className="font-bold">{invoice.student.class}</span>
                 </p>
                 <p className="flex justify-between w-full max-w-[200px]">
                    <span className="text-zinc-500">Phone:</span>
                    <span className="font-bold">{invoice.student.phone}</span>
                 </p>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] text-zinc-400 uppercase font-black tracking-[0.2em] mb-4">Payment Summary</p>
              <div className="space-y-2">
                 <div className="flex justify-end gap-8 items-baseline">
                    <span className="text-sm text-zinc-500 uppercase">Subtotal</span>
                    <span className="text-xl font-bold">{formatCurrency(invoice.total)}</span>
                 </div>
                 <div className="flex justify-end gap-8 items-baseline text-zinc-500">
                    <span className="text-sm uppercase">Total Paid</span>
                    <span className="text-xl font-bold">{formatCurrency(invoice.paid)}</span>
                 </div>
                 <div className="flex justify-end gap-8 items-center h-12 bg-rose-50 px-4 rounded text-rose-600 font-black">
                    <span className="text-xs uppercase tracking-widest">Balance Due</span>
                    <span className="text-2xl">{formatCurrency(invoice.due)}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Invoice Items */}
        <div className="mb-12">
           <table className="w-full">
              <thead>
                 <tr className="bg-zinc-900 text-zinc-100 uppercase text-[10px] tracking-widest font-black">
                    <th className="p-4 text-left">Description</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-right">Amount</th>
                 </tr>
              </thead>
              <tbody className="divide-y border-b text-sm">
                 <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="p-4 py-8">
                       <p className="font-bold text-lg mb-1 leading-none">{invoice.student.combinations}</p>
                       <p className="text-zinc-500 text-xs">Standard academic package for Class {invoice.student.class}</p>
                    </td>
                    <td className="p-4">
                       <span className="bg-zinc-100 px-3 py-1 rounded-full text-zinc-900 font-bold text-[10px] uppercase">Curriculum</span>
                    </td>
                    <td className="p-4 text-right font-black text-lg">
                       {formatCurrency(invoice.total)}
                    </td>
                 </tr>
              </tbody>
           </table>
        </div>

        {/* Payment History */}
        {invoice.payments.length > 0 && (
          <div className="mb-12">
            <h4 className="text-[10px] text-zinc-400 uppercase font-black tracking-[0.2em] mb-4 flex items-center gap-2">
              <History size={12} className="text-zinc-400" /> Payment History
            </h4>
            <div className="grid gap-2">
              {invoice.payments.map((p, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg text-sm group hover:bg-zinc-100 transition-all border border-transparent hover:border-zinc-200">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                        {i+1}
                      </div>
                      <span className="font-medium">{p.date}</span>
                   </div>
                   <span className="font-black text-emerald-600">{formatCurrency(p.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-dashed flex justify-between items-end">
           <div className="max-w-[300px]">
              <p className="text-xs text-zinc-400 font-medium mb-4 italic">Thank you for choosing Geetanjali. Please keep this invoice for your records.</p>
              <div className="h-20 w-48 border bg-zinc-50 rounded flex flex-col justify-end p-2 opacity-50 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-zinc-200" />
                 <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest text-center">Authorized Signature</p>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest mb-1 italic">V2 Digital Signature verified</p>
              <p className="text-[9px] text-zinc-400 font-mono">HASH: 0x29A8...F9B2</p>
           </div>
        </div>
      </div>
    </div>
  );
}
