import React from 'react';
import { ScanLog } from '../../types/database';
import { useLogsStore } from '../../stores/useLogsStore';
import { Star, CheckSquare, Square, Eye, Tag as TagIcon } from 'lucide-react';

interface Props {
  logs: ScanLog[];
}

export const VirtualizedLogList: React.FC<Props> = ({ logs }) => {
  const { selectedIds, toggleSelectId, setSelectedLogDetail, toggleFavorite } = useLogsStore();

  if (logs.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
        <p className="text-slate-400 text-sm font-medium">No logs found matching your search or filters.</p>
        <p className="text-slate-500 text-xs">Try scanning a new code or clearing your active filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {logs.map((log) => {
        const isSelected = log.id ? selectedIds.includes(log.id) : false;
        const dateStr = new Date(log.timestamp).toLocaleString();

        return (
          <div
            key={log.id || log.timestamp}
            className={`glass-card p-4 rounded-2xl border transition-all flex items-start gap-3 ${
              isSelected ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <button
              onClick={() => log.id && toggleSelectId(log.id)}
              className="mt-1 text-slate-500 hover:text-cyan-400 transition-colors"
            >
              {isSelected ? <CheckSquare className="w-5 h-5 text-cyan-400" /> : <Square className="w-5 h-5" />}
            </button>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  {log.parsedType}
                </span>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md text-[10px] font-medium">
                  {log.format}
                </span>
                {log.sessionName && (
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md text-[10px] font-medium">
                    Session: {log.sessionName}
                  </span>
                )}
                <span className="text-[10px] text-slate-500 ml-auto">{dateStr}</span>
              </div>

              <p className="text-xs text-slate-200 font-mono truncate">{log.rawContent}</p>

              {log.tags && log.tags.length > 0 && (
                <div className="flex items-center gap-1 pt-1 flex-wrap">
                  <TagIcon className="w-3 h-3 text-slate-500" />
                  {log.tags.map((t) => (
                    <span key={t} className="px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded text-[9px]">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 mt-1">
              <button
                onClick={() => log.id && toggleFavorite(log.id, log.isFavorite)}
                className={`p-1.5 rounded-lg transition-colors ${
                  log.isFavorite ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Star className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedLogDetail(log)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
