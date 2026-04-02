"use client";

import { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  UserPlus, 
  Upload, 
  FileDown, 
  Trash2, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [students, setStudents] = useState<any[]>([]); // This would normally be fetched from Supabase
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // CSV Bulk Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          console.log("Parsed CSV:", results.data);
          // Here we would sync with Supabase
          // const { data, error } = await supabase.from('students').insert(results.data);
          setTimeout(() => {
            setIsUploading(false);
            alert(`Successfully processed ${results.data.length} records.`);
          }, 1500);
        },
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">Manage your student records and bulk import data.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer">
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button variant="outline" className="gap-2" asChild>
              <span>
                <Upload size={16} />
                {isUploading ? "Uploading..." : "Bulk Import"}
              </span>
            </Button>
          </label>
          <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
            <UserPlus size={16} />
            Add Student
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search by RID, Name or Phone..."
            className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="ghost" className="gap-2">
          <FileDown size={16} />
          Export
        </Button>
      </div>

      {/* Students Table */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              <th className="px-6 py-4">RID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Class</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Combinations</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {/* Example Data Row */}
            <tr className="hover:bg-accent/50 transition-colors group">
              <td className="px-6 py-4 font-mono text-sm">RID-2024-001</td>
              <td className="px-6 py-4 font-medium">Ayush Singh</td>
              <td className="px-6 py-4">Ten</td>
              <td className="px-6 py-4 text-muted-foreground">9123456789</td>
              <td className="px-6 py-4 text-sm bg-blue-500/10 text-blue-500 w-fit rounded-full px-3 py-1">PCMB</td>
              <td className="px-6 py-4 text-right">
                <Button variant="ghost" size="icon">
                  <MoreHorizontal size={16} />
                </Button>
              </td>
            </tr>
            {/* Empty State */}
            {students.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Users size={48} className="opacity-20" />
                    <p>No students found. Try importing some data.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-t">
          <p className="text-sm text-muted-foreground">Showing 0 of 0 students</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled><ChevronLeft size={16} /></Button>
            <Button variant="outline" size="sm" disabled><ChevronRight size={16} /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
