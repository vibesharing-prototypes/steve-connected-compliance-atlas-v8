import { AppLayout } from '@diligentcorp/atlas-react-bundle';
import { useEffect } from 'react';
import { Outlet, Route, Routes } from 'react-router';
import './styles.css';

import Navigation from './Navigation.js';
import ComplianceReportsPage from './pages/ComplianceReportsPage.js';
import IndexPage from './pages/IndexPage.js';
import ReportEditPage from './pages/ReportEditPage.js';
import ReportSharePage from './pages/ReportSharePage.js';
import ReferenceAssetsPage from './pages/ReferenceAssetsPage.js';
import TrainingPlanPage from './pages/TrainingPlanPage.js';
import ReleaseNotesPage from './pages/ReleaseNotesPage.js';
import ReportsPage from './pages/ReportsPage.js';
import SettingsPage from './pages/SettingsPage.js';
import StylesPage from './pages/StylesPage.js';

function AppShell() {
  useEffect(() => {
    // Collapse the nav on initial load by clicking the toggle button inside the web component's shadow root
    const tryCollapse = () => {
      const navEl = document.querySelector('mock-hb-global-navigator');
      if (!navEl?.shadowRoot) return false;
      const btn = navEl.shadowRoot.querySelector<HTMLElement>('button[aria-label*="collapse"], button[aria-label*="Collapse"], button[part*="toggle"], button[class*="toggle"], header button, .toggle-button, [data-testid*="toggle"]');
      if (btn) { btn.click(); return true; }
      return false;
    };

    // Try immediately, then retry a couple of times while the web component initialises
    if (!tryCollapse()) {
      const t1 = setTimeout(() => { if (!tryCollapse()) setTimeout(tryCollapse, 200); }, 100);
      return () => clearTimeout(t1);
    }
  }, []);

  return (
    <AppLayout navigation={<Navigation />} orgName="Connected Compliance">
      <Outlet />
    </AppLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<AppShell />}
      >
        <Route index element={<IndexPage />} />
        <Route path="connected-compliance" element={<ComplianceReportsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/q1-2026" element={<ReportEditPage />} />
        <Route path="reports/q1-2026/share" element={<ReportSharePage />} />
        <Route path="training-plan" element={<TrainingPlanPage />} />
        <Route path="reference-assets" element={<ReferenceAssetsPage />} />
        <Route path="release-notes" element={<ReleaseNotesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="styles" element={<StylesPage />} />
      </Route>
    </Routes>
  );
}
