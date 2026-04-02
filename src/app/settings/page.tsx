"use client";

import { useState } from "react";
import { 
  Settings, 
  Building2, 
  Bell, 
  ShieldCheck, 
  Database, 
  Cloud,
  Mail,
  Smartphone,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your organization and system preferences.</p>
      </div>

      <div className="grid gap-8">
        {/* Organization Section */}
        <section className="bg-card border rounded-xl p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                 <Building2 size={20} />
              </div>
              <h2 className="text-xl font-bold">Organization Details</h2>
           </div>
           <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                 <label className="text-sm font-medium">Business Name</label>
                 <input type="text" className="w-full p-2 bg-background border rounded-lg" defaultValue="Geetanjali" />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Email Address</label>
                 <input type="email" className="w-full p-2 bg-background border rounded-lg" defaultValue="rabindrapathbhaban2003@gmail.com" />
              </div>
              <div className="space-y-2 md:col-span-2">
                 <label className="text-sm font-medium">Office Address</label>
                 <textarea className="w-full p-2 bg-background border rounded-lg min-h-[100px]" defaultValue="Thankurtala, Nimta, Kolkata, West Bengal 700049" />
              </div>
           </div>
        </section>

        {/* Database & Supabase Section */}
        <section className="bg-card border rounded-xl p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                 <Cloud size={20} />
              </div>
              <h2 className="text-xl font-bold">Supabase Configuration</h2>
           </div>
           <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Project URL</label>
                    <input type="text" className="w-full p-2 bg-background border rounded-lg font-mono text-xs" defaultValue="https://xyz123.supabase.co" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Anon Key</label>
                    <input type="password" underline-offset-4 className="w-full p-2 bg-background border rounded-lg font-mono text-xs" defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />
                 </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-emerald-500/5 text-emerald-600 rounded-lg border border-emerald-500/20">
                 <Database size={16} />
                 <span className="text-sm font-bold tracking-tight italic uppercase">Database Connected Successfully</span>
              </div>
           </div>
        </section>

        <div className="flex justify-end gap-3">
           <Button variant="outline">Reset Changes</Button>
           <Button className="gap-2">
              <Save size={16} />
              Save Settings
           </Button>
        </div>
      </div>
    </div>
  );
}
