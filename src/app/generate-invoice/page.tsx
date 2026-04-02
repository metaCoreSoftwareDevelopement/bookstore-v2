"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Student { rid: string; name: string; class: string; phone_number: string; combinations: string; price: number; }
interface BillEntry { Date: string; ammount: number; }
interface BillJSON { Bill: BillEntry[]; Total: number; Paid: number; Due: number; }
interface InvoiceData { student: Student; invoice: { invoice_id: string; bill_json: BillJSON } | null; newInvoiceId: string; }

const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

/* ========================== PRINT RECEIPT COMPONENT ========================== */
function ReceiptCopy({ student, invoiceId, billJSON, paymentMode, copyLabel }: {
  student: Student; invoiceId: string; billJSON: BillJSON; paymentMode: string; copyLabel: string;
}) {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const d = new Date();
    setDateStr(`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
  }, []);

  const boxStyle: React.CSSProperties = {
    border: "1px solid #ccc", padding: "0.5rem", width: "100%", boxSizing: "border-box",
    fontFamily: "Arial, sans-serif", fontSize: "0.78rem", color: "#000",
  };

  return (
    <div style={boxStyle}>
      {/* Org Header */}
      <div style={{ textAlign: "center", borderBottom: "1px solid #ccc", paddingBottom: "0.35rem", marginBottom: "0.35rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
          <span style={{ fontSize: "1.1rem" }}>🏠</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Geetanjali</div>
            <div style={{ fontSize: "0.75rem", color: "#333" }}>Fee Receipt / Invoice</div>
          </div>
        </div>
      </div>

      {/* Copy Label */}
      <div style={{ background: "#555", color: "white", fontWeight: 700, textAlign: "center", padding: "0.3rem", marginBottom: "0.4rem", fontSize: "0.85rem" }}>
        {copyLabel}
      </div>

      {/* Date + Receipt No */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
        <span><b>Date:</b>{dateStr}</span>
        <span><b>Receipt No:</b>{invoiceId}</span>
      </div>

      {/* Student Info */}
      <div style={{ marginBottom: "0.15rem" }}>
        <span><b>Name:</b>{student.name}</span>
        <span style={{ marginLeft: "1rem" }}><b>Class:</b>{student.class}</span>
      </div>
      <div style={{ marginBottom: "0.35rem" }}>
        <b>Contact No:</b>{student.phone_number}
      </div>

      {/* Class/Combination/Amount Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "0.4rem", fontSize: "0.78rem" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #000", padding: "0.2rem 0" }}>Class</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #000", padding: "0.2rem 0" }}>Combination</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #000", padding: "0.2rem 0" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "0.25rem 0", verticalAlign: "top" }}>{student.class}</td>
            <td style={{ padding: "0.25rem 0", verticalAlign: "top" }}>{student.combinations}</td>
            <td style={{ padding: "0.25rem 0", textAlign: "right", verticalAlign: "top" }}>{Number(billJSON.Total).toLocaleString("en-IN")}</td>
          </tr>
        </tbody>
      </table>

      {/* Previous Payments */}
      <div style={{ fontWeight: 700, textAlign: "center", marginBottom: "0.25rem" }}>Previous Payments</div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "0.4rem", fontSize: "0.78rem" }}>
        <thead>
          <tr style={{ background: "#555", color: "white" }}>
            <th style={{ padding: "0.2rem 0.4rem", textAlign: "left" }}>Date</th>
            <th style={{ padding: "0.2rem 0.4rem", textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {billJSON.Bill.length === 0 ? (
            <tr><td colSpan={2} style={{ padding: "0.25rem", textAlign: "center", color: "#777", fontStyle: "italic" }}>No payments</td></tr>
          ) : billJSON.Bill.map((entry, i) => (
            <tr key={i}>
              <td style={{ padding: "0.25rem 0.4rem", borderBottom: "1px dotted #ccc" }}>{entry.Date}</td>
              <td style={{ padding: "0.25rem 0.4rem", borderBottom: "1px dotted #ccc", textAlign: "right" }}>{Number(entry.ammount).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paid Amount + Payment Mode */}
      <div style={{ marginBottom: "0.2rem", fontWeight: 700 }}>
        Paid Amount: {billJSON.Paid > 0 ? `${Number(billJSON.Paid).toLocaleString("en-IN")}/-` : '0/-'}
      </div>
      <div style={{ marginBottom: "0.5rem", fontWeight: 700 }}>
        Payment Mode: {paymentMode}
      </div>

      {/* Signature Section */}
      <div style={{ borderTop: "1px dashed #ccc", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
        <div>
          <div>Depositer Sign</div>
          <div style={{ marginTop: "0.5rem" }}>Receiver Sign</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div>Issued By</div>
          <div style={{ marginTop: "0.5rem" }}>&nbsp;</div>
        </div>
      </div>
    </div>
  );
}

/* ========================== GENERATE INVOICE PAGE ========================== */
export default function GenerateInvoicePage() {
  const [rid, setRid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<InvoiceData | null>(null);
  const [paid, setPaid] = useState(0);
  const [due, setDue] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [billJSON, setBillJSON] = useState<BillJSON | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setData(null); setSaved(false); setBillJSON(null);
    const res = await fetch("/api/invoice/search", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rid }),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error || "Student not found"); setLoading(false); return; }
    setData(json);
    const existing = json.invoice?.bill_json;
    const price = json.student.price;
    setPaid(existing?.Paid ?? 0);
    setDue(existing?.Due ?? price);
    if (existing) {
      setBillJSON(existing);
      setSaved(true); // already has invoice
    } else {
      setBillJSON({ Bill: [], Total: price, Paid: 0, Due: price });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    const invoiceId = data.invoice?.invoice_id ?? data.newInvoiceId;
    const res = await fetch("/api/invoice/save", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId, rid: data.student.rid, total: data.student.price, paid, due }),
    });
    if (res.ok) {
      const d = new Date();
      const day = String(d.getDate()).padStart(2,'0');
      const month = String(d.getMonth()+1).padStart(2,'0');
      const year = d.getFullYear();
      const newBill: BillJSON = {
        Bill: [{ Date: `${day}-${month}-${year}`, ammount: Number(paid) }],
        Total: data.student.price, Paid: Number(paid), Due: Number(due),
      };
      setBillJSON(newBill);
      setSaved(true);
    } else {
      const json = await res.json();
      setError(json.error || "Failed to save invoice");
    }
    setSaving(false);
  };

  const handlePrint = () => {
    const noprints = document.querySelectorAll<HTMLElement>('.no-print');
    noprints.forEach(el => { el.dataset.origDisplay = el.style.display; el.style.display = 'none'; });
    window.print();
    noprints.forEach(el => { el.style.display = el.dataset.origDisplay || ''; });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#dbeafe" }}>
      {/* Navbar */}
      <nav className="no-print" style={{ background: "#1e3a5f", padding: "0.875rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <a href="/home" style={{ color: "#93c5fd", textDecoration: "none", fontWeight: 600 }}>← Home</a>
          <span style={{ color: "white", fontWeight: 700 }}>| Generate Invoice</span>
        </div>
        <a href="/api/auth/logout" style={{ color: "#fca5a5", textDecoration: "none", fontWeight: 600 }}>
          <i className="bi bi-box-arrow-right" /> Logout
        </a>
      </nav>

      {/* Search Form */}
      {!data && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 56px)" }}>
          <form onSubmit={handleSearch} style={{ background: "white", borderRadius: "12px", padding: "2.5rem", width: "380px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ width: 70, height: 70, background: "#1e3a5f", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem", color: "white", fontSize: "1.75rem" }}>
                <i className="bi bi-file-earmark-plus-fill" />
              </div>
              <h2 style={{ fontWeight: 700, color: "#1e3a5f" }}>Generate Invoice</h2>
            </div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem", color: "#374151" }}>Registration Number (RID)</label>
            <input type="text" value={rid} onChange={e => setRid(e.target.value)} required placeholder="Enter student RID..."
              style={{ width: "100%", padding: "0.75rem", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "1rem", outline: "none", marginBottom: "1rem", boxSizing: "border-box" }} />
            {error && <p style={{ color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</p>}
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "0.75rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>
      )}

      {/* Bill View */}
      {data && billJSON && (
        <div style={{ padding: "1.5rem" }}>
          {/* Screen action bar */}
          <div className="no-print" style={{ maxWidth: "900px", margin: "0 auto 1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={() => { setData(null); setRid(""); setSaved(false); setBillJSON(null); }}
              style={{ background: "white", border: "2px solid #1e3a5f", borderRadius: "8px", color: "#1e3a5f", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: 600 }}>
              ← New Search
            </button>
            <span style={{ color: "white", fontWeight: 600 }}>
              Student: <b>{data.student.name}</b> | RID: {data.student.rid}
            </span>
          </div>

          {error && (
            <div className="no-print" style={{ maxWidth: "900px", margin: "0 auto 1.5rem", background: "#fee2e2", border: "1px solid #ef4444", borderRadius: "8px", padding: "1rem", color: "#dc2626", fontWeight: 600 }}>
              ⚠️ Error: {error}
            </div>
          )}

          {/* On-screen bill form */}
          <div className="no-print" style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", maxWidth: "900px", margin: "0 auto 2rem", padding: "2rem" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "1.25rem", color: "#1e3a5f" }}>
              Invoice: {data.invoice?.invoice_id ?? data.newInvoiceId}
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Student Info */}
              <div>
                <p><b>Name:</b> {data.student.name}</p>
                <p><b>RID:</b> {data.student.rid}</p>
                <p><b>Class:</b> {data.student.class}</p>
                <p><b>Phone:</b> {data.student.phone_number}</p>
                <p><b>Combination:</b> {data.student.combinations}</p>
                <p><b>Total Fee:</b> {fmt(data.student.price)}</p>
              </div>

              {/* Bill Entry */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontWeight: 600 }}>Total Amount</label>
                  <input type="number" value={data.student.price} readOnly
                    style={{ padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "6px", width: "140px", background: "#f9fafb" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontWeight: 600 }}>Paid Amount</label>
                  <input type="number" value={paid} disabled={saved}
                    onChange={e => { const p = Number(e.target.value); setPaid(p); setDue(data.student.price - p); }}
                    style={{ padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "6px", width: "140px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontWeight: 600 }}>Due Amount</label>
                  <input type="number" value={due} readOnly
                    style={{ padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "6px", width: "140px", background: "#fef2f2", color: due > 0 ? "#dc2626" : "#10b981", fontWeight: 700 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontWeight: 600 }}>Payment Mode</label>
                  <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)}
                    style={{ padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "6px", width: "140px" }}>
                    <option>Cash</option>
                    <option>UPI</option>
                    <option>Cheque</option>
                    <option>DD</option>
                    <option>Card</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              {!saved && (
                <button onClick={handleSave} disabled={saving}
                  style={{ padding: "0.65rem 1.5rem", background: saving ? "#93c5fd" : "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Saving..." : "💾 Save Invoice"}
                </button>
              )}
              {saved && (
                <button onClick={handlePrint}
                  style={{ padding: "0.65rem 1.5rem", background: "#1e3a5f", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
                  🖨️ Print Receipt
                </button>
              )}
            </div>
          </div>

          {/* PRINT LAYOUT — Two copies side by side */}
          <div style={{ display: "flex", gap: "0.75rem", maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ flex: 1 }}>
              <ReceiptCopy student={data.student} invoiceId={data.invoice?.invoice_id ?? data.newInvoiceId} billJSON={billJSON} paymentMode={paymentMode} copyLabel="Student Copy" />
            </div>
            <div style={{ flex: 1 }}>
              <ReceiptCopy student={data.student} invoiceId={data.invoice?.invoice_id ?? data.newInvoiceId} billJSON={billJSON} paymentMode={paymentMode} copyLabel="School Copy" />
            </div>
          </div>
        </div>
      )}

      {/* Print-specific global style */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
