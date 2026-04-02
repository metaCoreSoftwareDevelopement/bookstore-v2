"use client";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    label: "Generate Invoice",
    icon: "bi-file-earmark-plus-fill",
    href: "/generate-invoice",
    color: "#06b6d4",
    hoverBg: "#0891b2",
    desc: "Create a new bill for a student",
  },
  {
    label: "Update Invoice",
    icon: "bi-receipt-cutoff",
    href: "/update-invoice",
    color: "#10b981",
    hoverBg: "#059669",
    desc: "Add payment to existing bill",
  },
  {
    label: "Daily Reports",
    icon: "bi-pie-chart-fill",
    href: "/reports",
    color: "#ec4899",
    hoverBg: "#db2777",
    desc: "View bills by date",
  },
  {
    label: "Due Payments",
    icon: "bi-cash-coin",
    href: "/due-payments",
    color: "#f97316",
    hoverBg: "#ea580c",
    desc: "View all pending dues",
  },
  {
    label: "Classwise Reports",
    icon: "bi-building-fill-check",
    href: "/reports/class",
    color: "#8b5cf6",
    hoverBg: "#7c3aed",
    desc: "View payment summary by class",
  },
];

export default function HomePage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    router.push("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#3b82f6" }}>
      {/* Top bar */}
      <div style={{
        background: "#1e3a5f",
        padding: "1rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: 40, height: 40,
            background: "white", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem", color: "#1e3a5f",
          }}>
            <i className="bi bi-book-fill" />
          </div>
          <div>
            <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.1rem", margin: 0 }}>
              Geetanjali
            </h1>
            <p style={{ color: "#93c5fd", fontSize: "0.75rem", margin: 0 }}>
              Billing Management System
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444", color: "white",
            border: "none", borderRadius: "8px",
            padding: "0.5rem 1rem", fontWeight: 600,
            cursor: "pointer", fontSize: "0.875rem",
            display: "flex", alignItems: "center", gap: "0.4rem",
          }}
        >
          <i className="bi bi-box-arrow-right" /> Logout
        </button>
      </div>

      {/* Main content */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "calc(100vh - 64px)", padding: "2rem",
      }}>
        <div style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
          padding: "2.5rem",
          width: "100%", maxWidth: "640px",
        }}>
          <h2 style={{
            textAlign: "center", fontSize: "1.75rem", fontWeight: 800,
            color: "#1e3a5f", marginBottom: "2rem",
          }}>
            Invoice Management
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.25rem",
          }}>
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  background: "#f9fafb",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "2rem 1rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: "0.75rem",
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = item.color;
                    (e.currentTarget as HTMLDivElement).style.borderColor = item.color;
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                    (e.currentTarget.querySelector('.icon-el') as HTMLElement)!.style.color = "white";
                    (e.currentTarget.querySelector('.label-el') as HTMLElement)!.style.color = "white";
                    (e.currentTarget.querySelector('.desc-el') as HTMLElement)!.style.color = "rgba(255,255,255,0.85)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "#f9fafb";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    (e.currentTarget.querySelector('.icon-el') as HTMLElement)!.style.color = item.color;
                    (e.currentTarget.querySelector('.label-el') as HTMLElement)!.style.color = "#1e3a5f";
                    (e.currentTarget.querySelector('.desc-el') as HTMLElement)!.style.color = "#6b7280";
                  }}
                >
                  <i
                    className={`bi ${item.icon} icon-el`}
                    style={{ fontSize: "3.5rem", color: item.color, transition: "color 0.2s" }}
                  />
                  <h3
                    className="label-el"
                    style={{ fontWeight: 700, color: "#1e3a5f", fontSize: "1.1rem", transition: "color 0.2s", margin: 0 }}
                  >
                    {item.label}
                  </h3>
                  <p
                    className="desc-el"
                    style={{ color: "#6b7280", fontSize: "0.8rem", transition: "color 0.2s", margin: 0 }}
                  >
                    {item.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
