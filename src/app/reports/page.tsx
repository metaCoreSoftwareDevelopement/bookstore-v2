"use client";
import { useState } from "react";

interface ReportRow { InvoiceID: string; RID: string; StudentName: string; Date: string; Total: number; Paid: number; Due: number; Installments: number; TodayPayment: number; }

const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

const NAV_STYLE: React.CSSProperties = {
  background: "#1e3a5f", padding: "0.875rem 1.5rem",
  display: "flex", alignItems: "center", justifyContent: "space-between",
};

export default function ReportsPage() {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReportRow[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    const res = await fetch(`/api/reports?date=${date}`);
    const json = await res.json();
    setData(json.data ?? []);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#dbeafe" }}>
      <nav style={NAV_STYLE} className="no-print">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <a href="/home" style={{ color: "#93c5fd", textDecoration: "none", fontWeight: 600 }}>
            <i className="bi bi-arrow-left" /> Home
          </a>
          <span style={{ color: "#4b5563" }}>|</span>
          <span style={{ color: "white", fontWeight: 700 }}>Daily Reports</span>
        </div>
        <a href="/api/auth/logout" style={{ color: "#fca5a5", textDecoration: "none", fontWeight: 600 }}>
          <i className="bi bi-box-arrow-right" /> Logout
        </a>
      </nav>

      {/* Search form at top */}
      <div className="no-print" style={{ display: "flex", justifyContent: "center", padding: "2rem 1rem 1rem" }}>
        <form onSubmit={handleSearch} style={{
          background: "white", borderRadius: "12px", padding: "1.5rem 2rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)", display: "flex", alignItems: "flex-end", gap: "1rem",
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 40, height: 40, background: "#1e3a5f", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.1rem" }}>
              <i className="bi bi-book-fill" />
            </div>
          </div>
          <div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "0.4rem", color: "#374151" }}>
              Invoice Date
            </label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required
              style={{ padding: "0.65rem 1rem", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "1rem", outline: "none" }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ padding: "0.65rem 1.5rem", background: "#ec4899", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
            {loading ? "Loading..." : "Search"}
          </button>
          {data && data.length > 0 && (
            <button type="button" onClick={handlePrint}
              style={{ padding: "0.65rem 1.5rem", background: "#1e3a5f", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
              <i className="bi bi-printer" /> Print
            </button>
          )}
        </form>
      </div>

      {/* Report title (visible on print) */}
      <h1 style={{ textAlign: "center", textDecoration: "underline", fontSize: "1.75rem", fontWeight: 800, color: "#1e3a5f", marginBottom: "1rem" }}
        className="print-only">Daily Report — {date}</h1>

      {/* Results */}
      {searched && (
        <div style={{ padding: "1rem 2rem 3rem" }}>
          <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <div className="no-print" style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "#1e3a5f", margin: 0 }}>
                Results for: {date}
              </h2>
              {data && (
                <span style={{ background: "#dbeafe", color: "#1e3a5f", fontSize: "0.875rem", fontWeight: 700, padding: "0.25rem 0.75rem", borderRadius: "20px" }}>
                  {data.length} record{data.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>Loading...</div>
            ) : !data || data.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#6b7280" }}>
                <i className="bi bi-inbox" style={{ fontSize: "3rem", display: "block", marginBottom: "0.5rem" }} />
                No records found for this date.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                  <thead>
                    <tr style={{ background: "#374151", color: "white", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {["InvoiceID", "RID", "Name", "Date", "Total", "Today", "Paid", "Due", "Inst."].map((h) => (
                        <th key={h} style={{ padding: "0.75rem 1rem", textAlign: h === "Name" ? "left" : "center" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #e5e7eb", background: i % 2 === 0 ? "white" : "#f9fafb" }}>
                        <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>{row.InvoiceID}</td>
                        <td style={{ padding: "0.75rem 1rem" }}>{row.RID}</td>
                        <td style={{ padding: "0.75rem 1rem" }}>{row.StudentName}</td>
                        <td style={{ padding: "0.75rem 1rem" }}>{row.Date}</td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>{fmt(row.Total)}</td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "right", color: "#3b82f6", fontWeight: 700 }}>{fmt(row.TodayPayment)}</td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "right", color: "#10b981" }}>{fmt(row.Paid)}</td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "right", color: row.Due > 0 ? "#dc2626" : "#10b981", fontWeight: 700 }}>{fmt(row.Due)}</td>
                        <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>{row.Installments}</td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Summary footer */}
                  <tfoot>
                    <tr style={{ background: "#1e3a5f", color: "white", fontWeight: 700 }}>
                      <td colSpan={4} style={{ padding: "0.75rem 1rem" }}>TOTAL ({data.length} records)</td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>{fmt(data.reduce((s, r) => s + Number(r.Total), 0))}</td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "right", background: "#3b82f6" }}>{fmt(data.reduce((s, r) => s + Number(r.TodayPayment), 0))}</td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>{fmt(data.reduce((s, r) => s + Number(r.Paid), 0))}</td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>{fmt(data.reduce((s, r) => s + Number(r.Due), 0))}</td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>{data.reduce((s, r) => s + Number(r.Installments), 0)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
