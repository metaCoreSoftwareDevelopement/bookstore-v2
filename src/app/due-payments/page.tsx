"use client";
import { useState, useEffect } from "react";

interface DueRow { Rid: string; Name: string; Total: number; Paid: number; Due: number; }

const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

const NAV_STYLE: React.CSSProperties = {
  background: "#1e3a5f", padding: "0.875rem 1.5rem",
  display: "flex", alignItems: "center", justifyContent: "space-between",
};

export default function DuePaymentsPage() {
  const [data, setData] = useState<DueRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dues")
      .then((r) => r.json())
      .then((json) => { setData(json.data ?? []); setLoading(false); });
  }, []);

  const handlePrint = () => window.print();

  const totalDue = (data ?? []).reduce((s, r) => s + Number(r.Due), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#dbeafe" }}>
      <nav style={NAV_STYLE} className="no-print">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <a href="/home" style={{ color: "#93c5fd", textDecoration: "none", fontWeight: 600 }}>
            <i className="bi bi-arrow-left" /> Home
          </a>
          <span style={{ color: "#4b5563" }}>|</span>
          <span style={{ color: "white", fontWeight: 700 }}>Due Payments</span>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {data && data.length > 0 && (
            <button onClick={handlePrint}
              style={{ padding: "0.5rem 1rem", background: "#f97316", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
              <i className="bi bi-printer" /> Print
            </button>
          )}
          <a href="/api/auth/logout" style={{ color: "#fca5a5", textDecoration: "none", fontWeight: 600 }}>
            <i className="bi bi-box-arrow-right" /> Logout
          </a>
        </div>
      </nav>

      <div style={{ padding: "2rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }} className="no-print">
          <h1 style={{ fontWeight: 800, fontSize: "2rem", color: "#1e3a5f", margin: 0 }}>Due Payments</h1>
          {data && (
            <div style={{ background: "#fef3c7", border: "2px solid #f59e0b", borderRadius: "12px", padding: "0.75rem 1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#92400e", textTransform: "uppercase" }}>Total Outstanding</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#dc2626" }}>{fmt(totalDue)}</div>
            </div>
          )}
        </div>

        <h1 style={{ textAlign: "center", textDecoration: "underline", fontSize: "1.75rem", fontWeight: 800, color: "#1e3a5f", marginBottom: "1rem" }}
          className="print-only">Due Payments</h1>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#6b7280" }}>
            <i className="bi bi-arrow-clockwise" style={{ fontSize: "2rem", animation: "spin 1s linear infinite" }} />
            <p>Loading due payments...</p>
          </div>
        ) : !data || data.length === 0 ? (
          <div style={{ background: "white", borderRadius: "12px", padding: "4rem", textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
            <i className="bi bi-check-circle-fill" style={{ fontSize: "4rem", color: "#10b981", display: "block", marginBottom: "1rem" }} />
            <h2 style={{ color: "#10b981", fontWeight: 700 }}>All Payments Cleared!</h2>
            <p style={{ color: "#6b7280" }}>No due records found.</p>
          </div>
        ) : (
          <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr style={{ background: "#374151", color: "white", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {["RID", "Name", "Total", "Paid", "Due"].map((h) => (
                      <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #e5e7eb", background: i % 2 === 0 ? "white" : "#fef9f0" }}>
                      <td style={{ padding: "0.875rem 1rem", fontWeight: 700, color: "#1e3a5f" }}>{row.Rid}</td>
                      <td style={{ padding: "0.875rem 1rem", fontWeight: 600 }}>{row.Name}</td>
                      <td style={{ padding: "0.875rem 1rem" }}>{fmt(row.Total)}</td>
                      <td style={{ padding: "0.875rem 1rem", color: "#10b981", fontWeight: 600 }}>{fmt(row.Paid)}</td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <span style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "20px", padding: "0.25rem 0.75rem", color: "#dc2626", fontWeight: 700, fontSize: "0.9rem" }}>
                          {fmt(row.Due)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#1e3a5f", color: "white", fontWeight: 700 }}>
                    <td colSpan={2} style={{ padding: "0.875rem 1rem" }}>TOTAL ({data.length} students)</td>
                    <td style={{ padding: "0.875rem 1rem" }}>{fmt(data.reduce((s, r) => s + Number(r.Total), 0))}</td>
                    <td style={{ padding: "0.875rem 1rem" }}>{fmt(data.reduce((s, r) => s + Number(r.Paid), 0))}</td>
                    <td style={{ padding: "0.875rem 1rem" }}>{fmt(totalDue)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
