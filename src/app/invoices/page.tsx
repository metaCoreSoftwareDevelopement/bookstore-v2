"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  FileText, 
  Eye, 
  Printer, 
  CreditCard,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

// Mock data for initial UI development
const mockInvoices = [
  { id: "1", invoice_number: "INV-2024-001", student_rid: "RID-101", student_name: "Ayush Singh", total: 10000, paid: 5000, due: 5000, date: "2024-03-25", status: "Partial" },
  { id: "2", invoice_number: "INV-2024-002", student_rid: "RID-102", student_name: "Sinchan Nandy", total: 15000, paid: 15000, due: 0, date: "2024-03-28", status: "Paid" },
  { id: "3", invoice_number: "INV-2024-003", student_rid: "RID-103", student_name: "Rahul Kumar", total: 12000, paid: 0, due: 12000, date: "2024-03-30", status: "Unpaid" },
];

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage billing and track payments.</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/invoices/new">
            <Plus size={16} />
            Create Invoice
          </Link>
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search by Invoice #, RID, or Name..."
            className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            {filter}
          </Button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="grid gap-4">
        {mockInvoices.map((invoice) => (
          <div 
            key={invoice.id}
            className="group relative flex flex-col md:flex-row md:items-center justify-between p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 overflow-hidden"
            style={{ borderLeftColor: invoice.status === 'Paid' ? '#10b981' : invoice.status === 'Partial' ? '#f59e0b' : '#ef4444' }}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">{invoice.invoice_number}</span>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                  invoice.status === 'Paid' ? "bg-emerald-500/10 text-emerald-500" : 
                  invoice.status === 'Partial' ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                )}>
                  {invoice.status}
                </span>
              </div>
              <h3 className="text-lg font-bold">{invoice.student_name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-mono">{invoice.student_rid}</span>
                <span>•</span>
                <span>Issued: {invoice.date}</span>
              </p>
            </div>

            <div className="flex flex-col md:items-end gap-1 mt-4 md:mt-0">
              <div className="flex flex-col md:items-end">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-xl font-bold">{formatCurrency(invoice.total)}</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex flex-col md:items-end">
                  <span className="text-[10px] text-muted-foreground uppercase">Paid: {formatCurrency(invoice.paid)}</span>
                  <span className={cn(
                    "text-[10px] uppercase font-bold",
                    invoice.due > 0 ? "text-rose-500" : "text-emerald-500"
                  )}>
                    Due: {formatCurrency(invoice.due)}
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-border hidden md:block" />
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/invoices/${invoice.id}`}>
                      <Eye size={18} />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:text-blue-500">
                    <Printer size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Utility function duplication for standalone page development
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
