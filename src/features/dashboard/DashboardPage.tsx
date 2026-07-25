import React, { useEffect, useState } from 'react';
import { ScanLogRepository } from '../../services/repositories/ScanLogRepository';
import { GeneratorHistoryRepository } from '../../services/repositories/GeneratorHistoryRepository';
import { SessionRepository } from '../../services/repositories/SessionRepository';
import { ScanLog, ScanSession } from '../../types/database';
import { LayoutDashboard, Scan, QrCode, Folder, TrendingUp, Award } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [genCount, setGenCount] = useState(0);
  const [sessions, setSessions] = useState<ScanSession[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const allLogs = await ScanLogRepository.getAllLogs();
      const allGen = await GeneratorHistoryRepository.getAllHistory();
      const allSessions = await SessionRepository.getAllSessions();
      setLogs(allLogs);
      setGenCount(allGen.length);
      setSessions(allSessions);
    };
    loadData();
  }, []);

  // Compute stats
  const totalScans = logs.length;
  const favoritesCount = logs.filter((l) => l.isFavorite).length;

  const typeCounts: Record<string, number> = {};
  logs.forEach((l) => {
    typeCounts[l.parsedType] = (typeCounts[l.parsedType] || 0) + 1;
  });

  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Scans</span>
            <Scan className="w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100">{totalScans}</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Generated</span>
            <QrCode className="w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100">{genCount}</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Favorites</span>
            <Award className="w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100">{favoritesCount}</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Sessions</span>
            <Folder className="w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-slate-100">{sessions.length}</p>
        </div>
      </div>

      {/* Code Type Distribution Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Scanned Content Type Distribution</span>
          </div>

          {sortedTypes.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No scan data recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {sortedTypes.slice(0, 6).map(([type, count]) => {
                const pct = Math.round((count / totalScans) * 100);
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300">{type}</span>
                      <span className="text-cyan-400">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sessions Summary */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <Folder className="w-4 h-4" />
            <span>Scan Sessions Breakdown</span>
          </div>

          <div className="space-y-2.5">
            {sessions.map((s) => (
              <div key={s.id || s.name} className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200 block">{s.name}</span>
                  <span className="text-[10px] text-slate-500">{new Date(s.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg font-bold">
                  {s.scanCount} scans
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
