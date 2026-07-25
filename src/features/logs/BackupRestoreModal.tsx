import React, { useRef, useState } from 'react';
import { BackupRestoreService } from '../../services/export/backupRestoreService';
import { ExportFormattedService } from '../../services/export/exportFormattedService';
import { Download, Upload, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLogsStore } from '../../stores/useLogsStore';

interface Props {
  onClose: () => void;
}

export const BackupRestoreModal: React.FC<Props> = ({ onClose }) => {
  const { loadLogs } = useLogsStore();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleBackupExport = async () => {
    const json = await BackupRestoreService.exportFullBackup();
    ExportFormattedService.downloadFile(`qr_pro_backup_${Date.now()}.json`, json, 'application/json');
    setStatusMsg({ type: 'success', text: 'Full database backup downloaded successfully.' });
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      const res = await BackupRestoreService.importFullBackup(content, 'MERGE');
      if (res.success) {
        setStatusMsg({ type: 'success', text: res.message });
        await loadLogs();
      } else {
        setStatusMsg({ type: 'error', text: res.message });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-sm">Backup & Data Migration</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 text-slate-400 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Export your entire database (scan logs, generator history, templates, and sessions) to a JSON backup file or restore from a previous backup offline.
        </p>

        {statusMsg && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            statusMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleBackupExport}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" /> Export Complete Backup (JSON)
          </button>

          <input type="file" ref={fileRef} accept=".json" onChange={handleFileImport} className="hidden" />

          <button
            onClick={() => fileRef.current?.click()}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4 text-cyan-400" /> Import & Restore Backup File
          </button>
        </div>
      </div>
    </div>
  );
};
