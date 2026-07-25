import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { RefreshCw } from 'lucide-react';

const ScannerPage = lazy(() => import('../features/scanner/ScannerPage'));
const GeneratorPage = lazy(() => import('../features/generator/GeneratorPage'));
const LogsPage = lazy(() => import('../features/logs/LogsPage'));
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'));
const ToolsPage = lazy(() => import('../features/tools/ToolsPage'));
const SettingsPage = lazy(() => import('../features/settings/SettingsPage'));

const PageLoader = () => (
  <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-cyan-400">
    <RefreshCw className="w-8 h-8 animate-spin" />
    <span className="text-xs font-medium text-slate-400">Loading module...</span>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/scanner" replace />} />
          <Route
            path="scanner"
            element={
              <Suspense fallback={<PageLoader />}>
                <ScannerPage />
              </Suspense>
            }
          />
          <Route
            path="generator"
            element={
              <Suspense fallback={<PageLoader />}>
                <GeneratorPage />
              </Suspense>
            }
          />
          <Route
            path="logs"
            element={
              <Suspense fallback={<PageLoader />}>
                <LogsPage />
              </Suspense>
            }
          />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="tools"
            element={
              <Suspense fallback={<PageLoader />}>
                <ToolsPage />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<PageLoader />}>
                <SettingsPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/scanner" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
