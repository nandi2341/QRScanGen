import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { QrCode, Scan, History, LayoutDashboard, Wrench, Settings, Download } from 'lucide-react';
import { Toast } from '../components/Toast';
import { OfflineBadge } from '../components/OfflineBadge';
import { useUIStore } from '../stores/useUIStore';
import { useSettingsStore } from '../stores/useSettingsStore';

export const Layout: React.FC = () => {
  const { isPwaInstallable, deferredPrompt, setPwaInstallable } = useUIStore();
  const { loadSettings } = useSettingsStore();
  const location = useLocation();

  useEffect(() => {
    loadSettings();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaInstallable(true, e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, [loadSettings, setPwaInstallable]);

  const handleInstallPWA = () => {
    if (deferredPrompt && typeof (deferredPrompt as { prompt: () => void }).prompt === 'function') {
      (deferredPrompt as { prompt: () => void }).prompt();
    }
  };

  const navItems = [
    { path: '/scanner', label: 'Scanner', icon: Scan },
    { path: '/generator', label: 'Generator', icon: QrCode },
    { path: '/logs', label: 'Logs', icon: History },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tools', label: 'Tools', icon: Wrench },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <OfflineBadge />

      {/* Top Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <QrCode className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                QR Scanner & Generator Pro
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">100% Offline Browser PWA</p>
            </div>
          </div>

          {isPwaInstallable && (
            <button
              onClick={handleInstallPWA}
              className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" /> Install App
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile & Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800/80 px-2 py-2">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/scanner');
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 font-semibold scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <Toast />
    </div>
  );
};
