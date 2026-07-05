import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ThankYou from "./pages/ThankYou.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Terms from "./pages/Terms.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminGate from "./components/AdminGate.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="/admin"
          element={
            <AdminGate>
              <Dashboard />
            </AdminGate>
          }
        />
        {/* City + service landing pages, e.g. /folsom/pest-control.
            Kept last so it never shadows /admin, /privacy, /terms, etc. */}
        <Route path="/:citySlug/:serviceSlug" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
