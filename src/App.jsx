import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ThankYou from "./pages/ThankYou.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Terms from "./pages/Terms.jsx";
import Partner from "./pages/Partner.jsx";
import Contact from "./pages/Contact.jsx";
import ServiceAreas from "./pages/ServiceAreas.jsx";
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
        <Route path="/partner" element={<Partner />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service-areas" element={<ServiceAreas />} />
        <Route
          path="/admin"
          element={
            <AdminGate>
              <Dashboard />
            </AdminGate>
          }
        />
        <Route path="/:citySlug/:serviceSlug" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
