import React, { useEffect, useState } from 'react';
import { useLogsStore } from '../../stores/useLogsStore';
import { VirtualizedLogList } from './VirtualizedLogList';
import { LogDetailDrawer } from './LogDetailDrawer';
import { BackupRestoreModal } from './BackupRestoreModal';
import { Search, Download, Trash2, ShieldCheck, Tag as TagIcon, CheckSquare, Square } from 'lucide-react';
import { ExportFormattedService } from '../../services/export/exportFormattedService';

export const LogsPage: React.FC = () => {
  const {
    logs,
    searchQuery,
    selectedIds,
    selectedLogDetail,
    loadLogs,
    setSearchQuery,
    deleteSelected,
    bulkAddTag,
    selectAll,
    clearSelection
  } = useLogsStore();

  const [showBackupModal, setShowBackupModal] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showTagForm, setShowTagForm] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleExportSelected = (format: 'csv' | 'txt' | 'json' | 'pdf') => {
    const targetLogs = selectedIds.length > 0 ? logs.filter((l) => l.id && selectedIds.includes(l.id)) : logs;

    if (format === 'csv') {
      const csv = ExportFormattedService.exportToCSV(targetLogs);
      ExportFormattedService.downloadFile('scan_logs.csv', csv, 'text/csv');
    } else if (format === 'txt') {
      const txt = ExportFormattedService.exportToTXT(targetLogs);
      ExportFormattedService.downloadFile('scan_logs.txt', txt, 'text/plain');
    } else if (format === 'json') {
      const json = ExportFormattedService.exportToJSON(targetLogs);
      ExportFormattedService.downloadFile('scan_logs.json', json, 'application/json');
    } else if (format === 'pdf') {
      ExportFormattedService.exportToPDF(targetLogs).then((blob) => {
        ExportFormattedService.downloadFile('scan_logs.pdf', blob, 'application/pdf');
      });
    }
  };

  const handleBulkTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    await bulkAddTag(tagInput.trim());
    setTagInput('');
    setShowTagForm(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action & Search Bar */}
      <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search logs by content, type, or notes... (Ctrl+F)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={() => setShowBackupModal(true)}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
          >
            <ShieldCheck className="w-4 h-4" /> Backup / Restore
          </button>
        </div>

        {/* Multi-select Toolbar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={selectedIds.length === logs.length ? clearSelection : selectAll}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 font-medium"
            >
              {selectedIds.length === logs.length && logs.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-cyan-400" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>{selectedIds.length > 0 ? `${selectedIds.length} Selected` : 'Select All'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Export dropdown */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
              <span className="text-[10px] text-slate-400 font-bold px-1.5">Export:</span>
              <button
                onClick={() => handleExportSelected('csv')}
                className="px-2 py-0.5 hover:bg-slate-800 text-slate-300 rounded font-medium text-[11px]"
              >
                CSV
              </button>
              <button
                onClick={() => handleExportSelected('txt')}
                className="px-2 py-0.5 hover:bg-slate-800 text-slate-300 rounded font-medium text-[11px]"
              >
                TXT
              </button>
              <button
                onClick={() => handleExportSelected('json')}
                className="px-2 py-0.5 hover:bg-slate-800 text-slate-300 rounded font-medium text-[11px]"
              >
                JSON
              </button>
              <button
                onClick={() => handleExportSelected('pdf')}
                className="px-2 py-0.5 hover:bg-slate-800 text-slate-300 rounded font-medium text-[11px]"
              >
                PDF
              </button>
            </div>

            {selectedIds.length > 0 && (
              <>
                <button
                  onClick={() => setShowTagForm(!showTagForm)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl flex items-center gap-1"
                >
                  <TagIcon className="w-3.5 h-3.5 text-cyan-400" /> Tag
                </button>
                <button
                  onClick={deleteSelected}
                  className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold rounded-xl flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {showTagForm && selectedIds.length > 0 && (
          <form onSubmit={handleBulkTagSubmit} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Tag name for selected items..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-xl"
            >
              Apply Tag
            </button>
          </form>
        )}
      </div>

      {/* Log list */}
      <VirtualizedLogList logs={logs} />

      {/* Detail drawer & Modal */}
      {selectedLogDetail && <LogDetailDrawer />}
      {showBackupModal && <BackupRestoreModal onClose={() => setShowBackupModal(false)} />}
    </div>
  );
};

export default LogsPage;
