import { useState, useEffect } from "react";
import { api } from "../lib/api.js";

/**
 * Admin auth gate. The password itself is checked server-side only
 * (see netlify/functions/admin-login.js) — this component never has
 * access to the real password, only ever a signed session token
 * returned after a successful login. That token is what's stored and
 * sent on subsequent admin API calls.
 */
export default function AdminGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("sqa_admin_token");
    setUnlocked(!!token);
    setChecking(false);
  }, []);

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const { token } = await api.adminLogin(input);
      sessionStorage.setItem("sqa_admin_token", token);
      setUnlocked(true);
    } catch (err) {
      setError("Incorrect password.");
    } finally {
      setSubmitting(false);
    }
  }

  if (checking) return null;
  if (unlocked) return children;

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
      <form onSubmit={submit} className="bg-white border border-border rounded-2xl p-6 w-full max-w-sm shadow-card">
        <h1 className="font-semibold text-lg mb-1">Admin Access</h1>
        <p className="text-sm text-gray-500 mb-4">Enter your admin password to continue.</p>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          autoFocus
        />
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-4 bg-brand text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
