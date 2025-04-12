import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Dashboard from "./pages/dashboard";
import AuthPage from "./pages/auth";
import HistoryPage from "./pages/history";
import SettingsPage from "./pages/settings";
import AccountPage from "./pages/account";
import AnalyticsPage from "./pages/analytics";
import ClipGeneratorPage from "./pages/clip-generator";
import CaptionEditorPage from "./pages/caption-editor";
import AuthGuard from "./components/auth/AuthGuard";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthGuard>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/history" element={<HistoryPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/account" element={<AccountPage />} />
          <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
          <Route
            path="/dashboard/clip-generator"
            element={<ClipGeneratorPage />}
          />
          <Route
            path="/dashboard/caption-editor"
            element={<CaptionEditorPage />}
          />
          <Route path="/auth" element={<AuthPage />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </AuthGuard>
    </Suspense>
  );
}

export default App;
