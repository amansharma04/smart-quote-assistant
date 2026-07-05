import { useState } from "react";
import { LEAD_STATUSES } from "../../config/leadSchema.js";
import { Select } from "../../components/ui/Input.jsx";
import { X } from "lucide-react";

export default function LeadDetail({ lead, onClose, onUpdate }) {
  const [assignedBusiness, setAssignedBusiness] = useState(lead.assignedBusiness || "");
  const [internalNotes, setInternalNotes] = useState(lead.internalNotes || "");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-white w-full md:max-w-lg md:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-white">
          <div>
            <h2 className="font-semibold">{lead.name}</h2>
            <span className="text-xs text-gray-400">Lead ID: {lead.id}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Phone" value={lead.phone} />
            <Info label="Email" value={lead.email || "—"} />
            <Info label="City" value={lead.city || "—"} />
            <Info label="Zip" value={lead.zip || "—"} />
            <Info label="Industry" value={(lead.industry || "").replace("_", " ") || "—"} />
            <Info label="Service Needed" value={lead.serviceNeeded || "—"} />
            <Info label="Urgency" value={lead.urgency || "—"} />
            <Info label="Best Contact Time" value={lead.contactTime || "—"} />
            <Info label="Lead Score" value={lead.leadScore ?? "—"} />
            <Info label="Date" value={lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "—"} />
          </div>

          {lead.notes && (
            <div>
              <span className="block text-xs font-medium text-gray-500 mb-1">Notes from consumer</span>
              <p className="text-sm bg-gray-50 rounded-xl p-3">{lead.notes}</p>
            </div>
          )}

          <Select
            label="Status"
            value={lead.status}
            onChange={(e) => onUpdate({ status: e.target.value })}
            options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
          />

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1.5">Assigned Business</span>
            <input
              value={assignedBusiness}
              onChange={(e) => setAssignedBusiness(e.target.value)}
              onBlur={() => onUpdate({ assignedBusiness })}
              placeholder="e.g. Rivera Tax & Bookkeeping"
              className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1.5">Internal Notes</span>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              onBlur={() => onUpdate({ internalNotes })}
              rows={3}
              placeholder="Only visible to you."
              className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <span className="block text-xs text-gray-400">{label}</span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  );
}
