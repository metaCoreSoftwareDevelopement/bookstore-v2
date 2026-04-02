"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/home");
    } else {
      setError("Invalid username or password");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e3a5f 0%, #3b82f6 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: "420px",
        padding: "2.5rem",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "80px", height: "80px",
            background: "#1e3a5f",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem",
            fontSize: "2rem", color: "white"
          }}>
            <i className="bi bi-book-fill" />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e3a5f" }}>
            Geetanjali
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Billing Management System
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#374151" }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username"
              style={{
                width: "100%", padding: "0.75rem 1rem",
                border: "2px solid #e5e7eb", borderRadius: "8px",
                fontSize: "1rem", outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#374151" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              style={{
                width: "100%", padding: "0.75rem 1rem",
                border: "2px solid #e5e7eb", borderRadius: "8px",
                fontSize: "1rem", outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fca5a5",
              borderRadius: "8px", padding: "0.75rem 1rem",
              color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "0.875rem",
              background: loading ? "#93c5fd" : "#1e3a5f",
              color: "white", border: "none", borderRadius: "8px",
              fontSize: "1rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.75rem", color: "#9ca3af" }}>
          © 2024 Geetanjali. All rights reserved.
        </p>
      </div>
    </div>
  );
}
