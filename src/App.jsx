import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Events from "./pages/Events";
import Rewind from "./pages/Rewind";
import EventDetail from "./pages/EventDetail";
import Settings from "./pages/Settings";
import Integrations from "./pages/Integrations";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import OAuthCallback from "./pages/OAuthCallback";
import CompleteProfile from "./pages/CompleteProfile";
import Services from "./pages/Services";
import Sandbox from "./pages/Sandbox";
import Postmortems from "./pages/Postmortems";
import Topology from "./pages/Topology";
import { ToastContainer } from "./components/ui/Toast";


import { initGA, trackPageView } from "./util/analytics";

// Global Guard for handling query params or flags without locking production users to Sandbox
const GlobalGuard = ({ children }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Initialize analytics & track route change
  React.useEffect(() => {
    initGA();
    trackPageView(location.pathname + location.search);
  }, [location]);

  // Store forceAllow or demo flags if needed
  if (queryParams.get("forceAllow") === "true") {
    localStorage.setItem("forceAllow", "true");
  }

  return children;
};

// Simple Auth Guard
const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {




  return (
    <BrowserRouter>
      <GlobalGuard>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
          <Route path="/signup/complete-profile" element={<CompleteProfile />} />

          {/* Unauthenticated Sandbox Route */}
          <Route path="/sandbox" element={<Sandbox />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/rewind" replace />} />
            <Route path="rewind" element={<Rewind />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventDetail />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="services" element={<Services />} />
            <Route path="postmortems" element={<Postmortems />} />
            <Route path="topology" element={<Topology />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </GlobalGuard>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
