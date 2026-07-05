/**
 * Single place all client code talks to the backend through. Admin
 * endpoints automatically attach the session token from sessionStorage —
 * components never touch auth headers directly.
 */

const BASE = "/.netlify/functions";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Surface only the server's generic error message — never raw
    // response text, which could leak implementation details.
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

function adminHeaders() {
  const token = sessionStorage.getItem("sqa_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  submitLead: (lead) =>
    request("submit-lead", { method: "POST", body: JSON.stringify(lead) }),

  adminLogin: (password) =>
    request("admin-login", { method: "POST", body: JSON.stringify({ password }) }),

  getLeads: () =>
    request("get-leads", { headers: adminHeaders() }),

  updateLead: (lead) =>
    request("update-lead", { method: "POST", headers: adminHeaders(), body: JSON.stringify(lead) }),
};
