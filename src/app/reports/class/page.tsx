"use client";
import { useState, useEffect } from "react";

interface ClassStat {
  class: string;
  count: number;
  total: number;
  paid: number;
  due: number;
  students: any[];
}

const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

const NAV_STYLE: React.CSSProperties = {
  background: "#1e3a5f",
  padding: "0.875rem 1.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export default function ClassReportsPage() {
  const [data, setData] = useState<ClassStat[] | null>(null);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [activeBranch, setActiveBranch] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reports/classwise");
      const json = await res.json();
      if (res.ok) {
        setData(json.data ?? []);
      } else {
        setError(json.error || "Failed to load report");
      }
    } catch (e) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const handlePrint = () => window.print();

  // FILTERING LOGIC
  const filteredData = (data ?? []).map(classStat => {
    if (activeBranch === "All") return classStat;
    
    const branchStudents = classStat.students.filter((s: any) => s.branch === activeBranch);
    if (branchStudents.length === 0) return null;

    return {
      ...classStat,
      count: branchStudents.filter((s: any) => s.status !== 'Not Generated').length,
      pendingBills: branchStudents.filter((s: any) => s.status === 'Not Generated').length,
      total: branchStudents.reduce((sum: number, s: any) => sum + s.total, 0),
      paid: branchStudents.reduce((sum: number, s: any) => sum + s.paid, 0),
      due: branchStudents.reduce((sum: number, s: any) => sum + s.due, 0),
      students: branchStudents
    };
  }).filter(Boolean) as any[];

  const totalFees = filteredData.reduce((s, r) => s + r.total, 0);
  const totalPaid = filteredData.reduce((s, r) => s + r.paid, 0);
  const totalDue = filteredData.reduce((s, r) => s + r.due, 0);
  const totalStudents = filteredData.reduce((s, r) => s + r.count, 0);
  const totalPending = filteredData.reduce((s, r) => s + (r.pendingBills || 0), 0);

  const branches = ["All", "Sodepur", "Belgharia", "Burdwan"];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3ff" }} className={selectedClass ? "modal-open" : ""}>
      <nav style={NAV_STYLE} className="no-print">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <a href="/home" style={{ color: "#a5b4fc", textDecoration: "none", fontWeight: 600 }}>
            <i className="bi bi-arrow-left" /> Home
          </a>
          <span style={{ color: "#4b5563" }}>|</span>
          <span style={{ color: "white", fontWeight: 700 }}>Classwise Reports</span>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button onClick={handlePrint}
            style={{ padding: "0.5rem 1rem", background: "#6366f1", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
            <i className="bi bi-printer" /> Print Report
          </button>
          <a href="/api/auth/logout" style={{ color: "#fca5a5", textDecoration: "none", fontWeight: 600 }}>
            <i className="bi bi-box-arrow-right" /> Logout
          </a>
        </div>
      </nav>

      <div style={{ padding: "1.5rem 2rem 2rem" }} className="main-content">
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          
          {/* Branch Switching Tabs */}
          <div className="no-print" style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", background: "#eef2ff", padding: "0.4rem", borderRadius: "12px", width: "fit-content" }}>
            {branches.map(b => (
              <button 
                key={b}
                onClick={() => setActiveBranch(b)}
                style={{ 
                  padding: "0.6rem 1.25rem", 
                  background: activeBranch === b ? "#4f46e5" : "transparent",
                  color: activeBranch === b ? "white" : "#4b5563",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  transition: "all 0.2s"
                }}
              >
                {b}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }} className="no-print">
            <div>
              <h1 style={{ fontWeight: 800, fontSize: "2rem", color: "#1e3a5f", margin: 0 }}>
                {activeBranch === "All" ? "Institutional Summary" : `${activeBranch} Branch`}
              </h1>
              <p style={{ color: "#6b7280", margin: "0.25rem 0 0" }}>Financial overview grouped by class levels</p>
            </div>
            
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ background: "white", border: "1px solid #e0e7ff", borderRadius: "12px", padding: "1rem 1.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", textAlign: "center" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6366f1", textTransform: "uppercase" }}>Branch Students</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e3a5f" }}>{totalStudents + totalPending}</div>
              </div>
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", padding: "1rem 1.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", textAlign: "center" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#d97706", textTransform: "uppercase" }}>Bills Pending</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#d97706" }}>{totalPending}</div>
              </div>
              <div style={{ background: "white", border: "1px solid #fee2e2", borderRadius: "12px", padding: "1rem 1.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", textAlign: "center" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ef4444", textTransform: "uppercase" }}>Branch Due</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ef4444" }}>{fmt(totalDue)}</div>
              </div>
            </div>
          </div>

            {activeBranch !== "All" ? `${activeBranch} Branch - ` : ""}Overall Classwise Payment Summary

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#6b7280" }}>
              <i className="bi bi-arrow-clockwise" style={{ fontSize: "2rem", animation: "spin 1s linear infinite" }} />
              <p>Aggregating {activeBranch} data...</p>
            </div>
          ) : error ? (
            <div style={{ background: "#fef2f2", color: "#dc2626", padding: "2rem", borderRadius: "12px", textAlign: "center", border: "1px solid #fecaca" }}>
              <i className="bi bi-exclamation-triangle" style={{ fontSize: "2rem" }} />
              <p>{error}</p>
              <button onClick={fetchData} style={{ background: "#dc2626", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", marginTop: "1rem" }}>Retry</button>
            </div>
          ) : filteredData.length === 0 ? (
            <div style={{ background: "white", borderRadius: "12px", padding: "4rem", textAlign: "center", border: "1px dashed #cbd5e1" }}>
              <i className="bi bi-inbox" style={{ fontSize: "3rem", color: "#94a3b8", display: "block", marginBottom: "1rem" }} />
              <p style={{ color: "#6b7280", fontWeight: 600 }}>No students found for {activeBranch} branch.</p>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", overflow: "hidden", border: "1px solid #e5e7eb" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#4f46e5", color: "white" }}>
                      <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontWeight: 700 }}>Class Level</th>
                      <th style={{ padding: "1.25rem 1.5rem", textAlign: "center", fontWeight: 700 }}>Total Student</th>
                      <th style={{ padding: "1.25rem 1.5rem", textAlign: "center", fontWeight: 700 }}>Bills Done</th>
                      <th style={{ padding: "1.25rem 1.5rem", textAlign: "center", fontWeight: 700 }}>Pending</th>
                      <th style={{ padding: "1.25rem 1.5rem", textAlign: "right", fontWeight: 700 }}>Total Collected</th>
                      <th style={{ padding: "1.25rem 1.5rem", textAlign: "right", fontWeight: 700 }}>Total Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, i) => (
                      <tr 
                        key={i} 
                        style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "white" : "#fafaff", cursor: "pointer" }}
                        className="class-row"
                        onClick={() => setSelectedClass(row)}
                      >
                        <td style={{ padding: "1.25rem 1.5rem", fontWeight: 700, color: "#4f46e5" }}>
                          {row.class} <i className="bi bi-chevron-right" style={{ fontSize: "0.75rem", verticalAlign: "middle" }} />
                        </td>
                        <td style={{ padding: "1.25rem 1.5rem", textAlign: "center", fontWeight: 600 }}>{row.count + (row.pendingBills || 0)}</td>
                        <td style={{ padding: "1.25rem 1.5rem", textAlign: "center", color: "#10b981", fontWeight: 700 }}>{row.count}</td>
                        <td style={{ padding: "1.25rem 1.5rem", textAlign: "center" }}>
                          <span style={{ 
                            color: (row.pendingBills || 0) > 0 ? "#d97706" : "#10b981", 
                            fontWeight: 700 
                          }}>
                            {row.pendingBills || 0}
                          </span>
                        </td>
                        <td style={{ padding: "1.25rem 1.5rem", textAlign: "right", color: "#10b981", fontWeight: 600 }}>{fmt(row.paid)}</td>
                        <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>
                          <span style={{ 
                            background: Number(row.due) > 0 ? "#fef2f2" : "#f0fdf4", 
                            color: Number(row.due) > 0 ? "#ef4444" : "#10b981", 
                            padding: "0.35rem 0.75rem", 
                            borderRadius: "20px", 
                            fontWeight: 700,
                            fontSize: "0.85rem"
                          }}>
                            {fmt(row.due)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#1e1b4b", color: "white", fontWeight: 800, fontSize: "1.05rem" }}>
                      <td style={{ padding: "1.25rem 1.5rem" }}>INSTITUTION TOTAL</td>
                      <td style={{ padding: "1.25rem 1.5rem", textAlign: "center" }}>{totalStudents + totalPending}</td>
                      <td style={{ padding: "1.25rem 1.5rem", textAlign: "center" }}>{totalStudents}</td>
                      <td style={{ padding: "1.25rem 1.5rem", textAlign: "center" }}>{totalPending}</td>
                      <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>{fmt(totalPaid)}</td>
                      <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>{fmt(totalDue)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STUDENT DETAIL MODAL */}
      {selectedClass && (
        <div 
          style={{ 
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
            background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", 
            alignItems: "center", justifyContent: "center", padding: "1.5rem"
          }}
          className="modal-overlay"
          onClick={() => setSelectedClass(null)}
        >
          <div 
            style={{ 
              background: "white", borderRadius: "16px", width: "100%", maxWidth: "900px", 
              maxHeight: "90vh", display: "flex", flexDirection: "column", 
              boxShadow: "0 25px 50px rgba(0,0,0,0.25)", overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ background: "#4f46e5", padding: "1.25rem 1.5rem", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }} className="no-print">
              <div>
                <h2 style={{ margin: 0, fontWeight: 800 }}>{selectedClass.class} - {activeBranch === "All" ? "Institutional" : activeBranch} Detail</h2>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={handlePrint} style={{ background: "white", color: "#4f46e5", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>
                  <i className="bi bi-printer" /> Print
                </button>
                <button onClick={() => setSelectedClass(null)} style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>
                  Close
                </button>
              </div>
            </div>

            <h1 className="print-only" style={{ textAlign: "center", textDecoration: "underline", marginBottom: "1rem" }}>
              Student Payment Details - {selectedClass.class} ({activeBranch}) - Overall History
            </h1>

            {/* Modal Body */}
            <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }} className="no-print">
                <div style={{ flex: 1, background: "#f5f3ff", padding: "1rem", borderRadius: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.7rem", color: "#6366f1", fontWeight: 800 }}>TOTAL COLLECTED</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#10b981" }}>{fmt(selectedClass.paid)}</div>
                </div>
                <div style={{ flex: 1, background: "#fff1f2", padding: "1rem", borderRadius: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 800 }}>PENDING DUES</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ef4444" }}>{fmt(selectedClass.due)}</div>
                </div>
                <div style={{ flex: 1, background: "#fffbeb", padding: "1rem", borderRadius: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.7rem", color: "#d97706", fontWeight: 800 }}>NOT GENERATED</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#d97706" }}>{selectedClass.pendingBills || 0}</div>
                </div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #4f46e5", background: "#f8faff" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left" }}>RID</th>
                    <th style={{ padding: "0.75rem", textAlign: "left" }}>Student Name</th>
                    <th style={{ padding: "0.75rem", textAlign: "right" }}>Total Fee</th>
                    <th style={{ padding: "0.75rem", textAlign: "right" }}>Paid</th>
                    <th style={{ padding: "0.75rem", textAlign: "right" }}>Due / Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClass.students.map((student: any, i: number) => (
                    <tr key={i} style={{ 
                      borderBottom: "1px solid #f3f4f6",
                      opacity: student.status === 'Not Generated' ? 0.8 : 1,
                      background: student.status === 'Not Generated' ? "#fffbeb" : "inherit"
                    }}>
                      <td style={{ padding: "0.75rem", fontWeight: 700, color: "#6b7280" }}>{student.rid}</td>
                      <td style={{ padding: "0.75rem", fontWeight: 600, color: "#1e3a5f" }}>{student.name}</td>
                      <td style={{ padding: "0.75rem", textAlign: "right" }}>{student.status === 'Not Generated' ? "—" : fmt(student.total)}</td>
                      <td style={{ padding: "0.75rem", textAlign: "right", color: "#10b981" }}>{student.status === 'Not Generated' ? "—" : fmt(student.paid)}</td>
                      <td style={{ padding: "0.75rem", textAlign: "right", fontWeight: 700 }}>
                        {student.status === 'Not Generated' ? (
                          <span style={{ color: "#d97706", fontSize: "0.75rem", textTransform: "uppercase" }}>Bill Pending</span>
                        ) : (
                          <span style={{ color: Number(student.due) > 0 ? "#ef4444" : "#10b981" }}>{fmt(student.due)}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div style={{ background: "#f9fafb", padding: "1rem 1.5rem", borderTop: "1px solid #e5e7eb", textAlign: "right" }} className="no-print">
              <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>Showing {selectedClass.students.length} students</span>
            </div>
          </div>
        </div>
      )}


      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .modal-open .main-content { display: none !important; }
          .modal-overlay { position: static !important; background: none !important; padding: 0 !important; }
          .modal-overlay > div { box-shadow: none !important; width: 100% !important; max-width: none !important; height: auto !important; max-height: none !important; overflow: visible !important; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .class-row:hover { background: #eef2ff !important; }
      `}</style>
    </div>
  );
}
