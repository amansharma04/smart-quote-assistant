import { useLocation, Link, Navigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function ThankYou() {
  const { state } = useLocation();

  // Direct visits without state (no completed quote) get sent home
  // rather than shown a confusing empty confirmation.
  if (!state?.location) return <Navigate to="/" replace />;

  const { location } = state;

  return (
    <div className="min-h-screen bg-canvas text-ink flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-full bg-canvasAlt flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={26} className="text-ink" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Your quote request is in!</h1>
        <p className="text-muted text-[15px] mt-3">
          A local {location.service.toLowerCase()} pro serving {location.city} will reach out to
          you shortly. Thanks for requesting a quote.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center bg-ink text-white px-6 py-3 rounded-full text-[15px] font-medium mt-7 hover:bg-black transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
