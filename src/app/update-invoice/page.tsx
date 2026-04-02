"use client";
import { useState, useEffect } from "react";

interface Student { rid: string; name: string; class: string; phone_number: string; combinations: string; price: number; }
interface BillEntry { Date: string; ammount: number; }
interface BillJSON { Bill: BillEntry[]; Total: number; Paid: number; Due: number; }
interface InvoiceData { student: Student; invoice: { invoice_id: string; bill_json: BillJSON } | null; newInvoiceId: string; }

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
      <div style={{ textAlign: "center", borderBottom: "1px solid #ccc", paddingBottom: "0.35rem", marginBottom: "0.35rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
          <span style={{ fontSize: "1.1rem" }}>🏠</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Geetanjali</div>
            <div style={{ fontSize: "0.75rem", color: "#333" }}>Fee Receipt / Invoice</div>
          </div>
        </div>
      </div>
      <div style={{ background: "#555", color: "white", fontWeight: 700, textAlign: "center", padding: "0.3rem", marginBottom: "0.4rem", fontSize: "0.85rem" }}>
        {copyLabel}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
        <span><b>Date:</b>{dateStr}</span>
        <span><b>Receipt No:</b>{invoiceId}</span>
      </div>
      <div style={{ marginBottom: "0.15rem" }}>
        <span><b>Name:</b>{student.name}</span>
        <span style={{ marginLeft: "1rem" }}><b>Class:</b>{student.class}</span>
      </div>
      <div style={{ marginBottom: "0.35rem" }}><b>Contact No:</b>{student.phone_number}</div>
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
      <div style={{ marginBottom: "0.2rem", fontWeight: 700 }}>
        Paid Amount: {billJSON.Paid > 0 ? `${Number(billJSON.Paid).toLocaleString("en-IN")}/-` : "0/-"}
      </div>
      <div style={{ marginBottom: "0.5rem", fontWeight: 700 }}>Payment Mode: {paymentMode}</div>
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

const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function UpdateInvoicePage() {
  const [rid, setRid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<InvoiceData | null>(null);
  const [billJSON, setBillJSON] = useState<BillJSON | null>(null);
  const [newPayment, setNewPayment] = useState("");
  const [showPayField, setShowPayField] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [paymentMode, setPaymentMode] = useState("Cash");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setData(null); setUpdated(false); setShowPayField(false); setBillJSON(null);
    const res = await fetch("/api/invoice/search", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rid }),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error || "Student not found"); setLoading(false); return; }
    if (!json.invoice) { setError("No invoice found for this RID. Please generate an invoice first."); setLoading(false); return; }
    setData(json);
    setBillJSON(json.invoice.bill_json);
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!data || !newPayment) return;
    setUpdating(true);
    const res = await fetch("/api/invoice/payment", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rid: data.student.rid, newPayment: Number(newPayment) }),
    });
    const json = await res.json();
    setUpdating(false);
    if (res.ok) { 
      setBillJSON(json.billJson); 
      setNewPayment(""); 
      setShowPayField(false); 
      setUpdated(true); 
    } else {
      setError(json.error || "Failed to update invoice");
    }
  };

  const handlePrint = () => {
    const noprints = document.querySelectorAll<HTMLElement>('.no-print');
    noprints.forEach(el => { el.dataset.origDisplay = el.style.display; el.style.display = 'none'; });
    window.print();
    noprints.forEach(el => { el.style.display = el.dataset.origDisplay || ''; });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#dbeafe" }}>
      <nav className="no-print" style={{ background: "#1e3a5f", padding: "0.875rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <a href="/home" style={{ color: "#93c5fd", textDecoration: "none", fontWeight: 600 }}>← Home</a>
          <span style={{ color: "white", fontWeight: 700 }}>| Update Invoice</span>
        </div>
        <a href="/api/auth/logout" style={{ color: "#fca5a5", textDecoration: "none", fontWeight: 600 }}>Logout</a>
      </nav>

      {/* Search Form */}
      {!data && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 56px)" }}>
          <form onSubmit={handleSearch} style={{ background: "white", borderRadius: "12px", padding: "2.5rem", width: "380px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ width: 70, height: 70, background: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem", color: "white", fontSize: "1.75rem" }}>
                <i className="bi bi-receipt-cutoff" />
              </div>
              <h2 style={{ fontWeight: 700, color: "#1e3a5f" }}>Update Invoice</h2>
            </div>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem", color: "#374151" }}>Registration Number (RID)</label>
            <input type="text" value={rid} onChange={e => setRid(e.target.value)} required placeholder="Enter student RID..."
              style={{ width: "100%", padding: "0.75rem", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "1rem", outline: "none", marginBottom: "1rem", boxSizing: "border-box" }} />
            {error && <p style={{ color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</p>}
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "0.75rem", background: "#10b981", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>
      )}

      {/* Bill view */}
      {data && billJSON && (
        <div style={{ padding: "1.5rem" }}>
          <div className="no-print" style={{ maxWidth: "900px", margin: "0 auto 1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => { setData(null); setRid(""); setUpdated(false); setBillJSON(null); }}
              style={{ background: "white", border: "2px solid #1e3a5f", borderRadius: "8px", color: "#1e3a5f", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: 600 }}>
              ← New Search
            </button>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {billJSON.Due > 0 && (
                <button onClick={() => setShowPayField(!showPayField)}
                  style={{ padding: "0.5rem 1.25rem", background: "#10b981", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
                  💰 Add Payment
                </button>
              )}
              <button onClick={handlePrint}
                style={{ padding: "0.5rem 1.25rem", background: "#1e3a5f", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
                🖨️ Print Receipt
              </button>
            </div>
          </div>

          {error && (
            <div className="no-print" style={{ maxWidth: "900px", margin: "0 auto 1.5rem", background: "#fee2e2", border: "1px solid #ef4444", borderRadius: "8px", padding: "1rem", color: "#dc2626", fontWeight: 600 }}>
              ⚠️ Error: {error}
            </div>
          )}

          {/* Add Payment Form */}
          {showPayField && (
            <div className="no-print" style={{ background: "white", borderRadius: "12px", padding: "1.5rem", maxWidth: "900px", margin: "0 auto 1.5rem", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1rem", color: "#1e3a5f" }}>Add New Payment</h3>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
                <div>
                  <label style={{ fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Amount (₹)</label>
                  <input type="number" value={newPayment} onChange={e => setNewPayment(e.target.value)} placeholder="Enter amount..."
                    style={{ padding: "0.65rem 1rem", border: "2px solid #d1d5db", borderRadius: "8px", fontSize: "1rem", outline: "none", width: "200px" }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Payment Mode</label>
                  <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)}
                    style={{ padding: "0.65rem 1rem", border: "2px solid #d1d5db", borderRadius: "8px", fontSize: "1rem", width: "160px" }}>
                    <option>Cash</option><option>UPI</option><option>Cheque</option><option>DD</option><option>Card</option>
                  </select>
                </div>
                <button onClick={handleUpdate} disabled={updating || !newPayment}
                  style={{ padding: "0.65rem 1.5rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
                  {updating ? "Updating..." : "Update Bill"}
                </button>
              </div>
              {/* Status summary */}
              <div style={{ marginTop: "1rem", display: "flex", gap: "2rem", fontSize: "0.9rem" }}>
                <span>Total: <b>{fmt(billJSON.Total)}</b></span>
                <span style={{ color: "#10b981" }}>Paid: <b>{fmt(billJSON.Paid)}</b></span>
                <span style={{ color: "#dc2626" }}>Due: <b>{fmt(billJSON.Due)}</b></span>
              </div>
            </div>
          )}

          {/* Full Paid badge */}
          {billJSON.Due <= 0 && (
            <div className="no-print" style={{ background: "#d1fae5", border: "2px solid #10b981", borderRadius: "12px", padding: "1rem 1.5rem", maxWidth: "900px", margin: "0 auto 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#065f46", fontWeight: 700 }}>
              ✅ Full Paid — All dues cleared!
            </div>
          )}

          {/* PRINT LAYOUT — TWO COPIES */}
          <div style={{ display: "flex", gap: "0.75rem", maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ flex: 1 }}>
              <ReceiptCopy student={data.student} invoiceId={data.invoice?.invoice_id ?? ""} billJSON={billJSON} paymentMode={paymentMode} copyLabel="Student Copy" />
            </div>
            <div style={{ flex: 1 }}>
              <ReceiptCopy student={data.student} invoiceId={data.invoice?.invoice_id ?? ""} billJSON={billJSON} paymentMode={paymentMode} copyLabel="School Copy" />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
