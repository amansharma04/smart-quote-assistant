import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api.js";
import { LOCATIONS } from "../../config/locations.js";
import { LEAD_STATUSES } from "../../config/leadSchema.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import { Input, Select } from "../../components/ui/Input.jsx";
import LeadDetail from "./LeadDetail.jsx";
import { Download } from "lucide-react";

const STATUS_COLORS = {
  New: "bg-blue-50 text-blue-700",
  Contacted: "bg-amber-50 text-amber-700",
  Assigned: "bg-purple-50 text-purple-700",
  Sold: "bg-green-50 text-green-700",
  Closed: "bg-gray-100 text-gray-500",
  Rejected: "bg-red-50 text-red-600",
};

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  const industries = [...new Set(LOCATIONS.map((l) => l.industry))];
  const cities = [...new Set(LOCATIONS.map((l) => l.city))];

  function load() {
    setLoading(true);
    api
      .getLeads()
      .then((data) => setLeads(data.leads || data || []))
      .catch((err) => {
        // Token expired or invalid — clear it and force re-login rather
        // than showing a confusing error on a blank dashboard.
        if (err.message?.toLowerCase().includes("unauthorized")) {
          sessionStorage.removeItem("sqa_admin_token");
          window.location.reload();
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        !search ||
        [lead.name, lead.phone, lead.email, lead.city].join(" ").toLowerCase().includes(search.toLowerCase());
      const matchesIndustry = !industryFilter || lead.industry === industryFilter;
      const matchesCity = !cityFilter || lead.city === cityFilter;
      const matchesStatus = !statusFilter || lead.status === statusFilter;
      return matchesSearch && matchesIndustry && matchesCity && matchesStatus;
    });
  }, [leads, search, industryFilter, cityFilter, statusFilter]);

  const stats = useMemo(() => computeStats(leads), [leads]);

  function exportCsv() {
    const headers = [
      "Lead ID", "Date", "Industry", "City", "Zip", "Name", "Phone", "Email",
      "Service Needed", "Urgency", "Notes", "Status", "Assigned Business",
      "Internal Notes", "Lead Score",
    ];
    const rows = filtered.map((l) => [
      l.id, l.createdAt, l.industry, l.city, l.zip, l.name, l.phone, l.email,
      l.serviceNeeded, l.urgency, l.notes, l.status, l.assignedBusiness,
      l.internalNotes, l.leadScore,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleUpdate(patch) {
    const updated = { ...selectedLead, ...patch };
    setLeads((ls) => ls.map((l) => (l.id === updated.id ? updated : l)));
    setSelectedLead(updated);
    try {
      await api.updateLead(updated);
    } catch (err) {
      if (err.message?.toLowerCase().includes("unauthorized")) {
        sessionStorage.removeItem("sqa_admin_token");
        window.location.reload();
      }
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 font-semibold">Smart Quote Assistant — Admin</div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Leads" value={stats.total} />
          <StatCard label="New Leads" value={stats.new} />
          <StatCard label="Top Industry" value={stats.topIndustry || "—"} small />
          <StatCard label="Top City" value={stats.topCity || "—"} small />
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          <Card>
            <h3 className="text-xs font-semibold text-gray-500 mb-2">Leads by Industry</h3>
            {Object.entries(stats.byIndustry).map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm py-1">
                <span className="capitalize">{k.replace("_", " ")}</span>
                <span className="text-gray-500">{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <h3 className="text-xs font-semibold text-gray-500 mb-2">Leads by City</h3>
            {Object.entries(stats.byCity).map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm py-1">
                <span>{k}</span>
                <span className="text-gray-500">{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <h3 className="text-xs font-semibold text-gray-500 mb-2">Leads by Status</h3>
            {Object.entries(stats.byStatus).map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm py-1">
                <span>{k}</span>
                <span className="text-gray-500">{v}</span>
              </div>
            ))}
          </Card>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-semibold">Leads ({filtered.length})</h2>
          <Button variant="secondary" onClick={exportCsv}>
            <Download size={16} /> Export CSV
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-3">
          <Input placeholder="Search name, phone, city..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            options={[{ value: "", label: "All industries" }, ...industries.map((i) => ({ value: i, label: i.replace("_", " ") }))]}
          />
          <Select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            options={[{ value: "", label: "All cities" }, ...cities.map((c) => ({ value: c, label: c }))]}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[{ value: "", label: "All statuses" }, ...LEAD_STATUSES.map((s) => ({ value: s, label: s }))]}
          />
        </div>

        <Card padded={false} className="overflow-x-auto">
          {loading ? (
            <p className="p-5 text-sm text-gray-400">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Industry</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Assigned</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => setSelectedLead(l)}
                    className="border-b border-border last:border-0 cursor-pointer hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">{l.name}</td>
                    <td className="px-4 py-3 text-gray-500">{l.city}</td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{(l.industry || "").replace("_", " ")}</td>
                    <td className="px-4 py-3">
                      <ScoreBadge score={l.leadScore} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[l.status] || "bg-gray-100"}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{l.assignedBusiness || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(l.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      No leads match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </Card>
      </main>

      {selectedLead && (
        <LeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdate={handleUpdate} />
      )}
    </div>
  );
}

function StatCard({ label, value, small }) {
  return (
    <Card className="text-center py-4">
      <div className={small ? "text-sm font-semibold truncate" : "text-2xl font-semibold"}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </Card>
  );
}

function ScoreBadge({ score = 0 }) {
  const color = score >= 70 ? "bg-green-50 text-green-700" : score >= 40 ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-500";
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{score}</span>;
}

function computeStats(leads) {
  const total = leads.length;
  const newCount = leads.filter((l) => l.status === "New").length;

  const byIndustry = {};
  const byCity = {};
  const byStatus = {};
  leads.forEach((l) => {
    if (l.industry) byIndustry[l.industry] = (byIndustry[l.industry] || 0) + 1;
    if (l.city) byCity[l.city] = (byCity[l.city] || 0) + 1;
    if (l.status) byStatus[l.status] = (byStatus[l.status] || 0) + 1;
  });

  const topIndustry = Object.entries(byIndustry).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topCity = Object.entries(byCity).sort((a, b) => b[1] - a[1])[0]?.[0];

  return { total, new: newCount, byIndustry, byCity, byStatus, topIndustry, topCity };
}
