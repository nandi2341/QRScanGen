import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useSessionStore } from '../../stores/useSessionStore';
import { FolderCheck, Plus, ToggleLeft, ToggleRight } from 'lucide-react';

export const BatchSessionControls: React.FC = () => {
  const { batchScanMode, activeSessionName, setBatchScanMode, setActiveSessionName } = useSettingsStore();
  const { sessions, loadSessions, createSession } = useSessionStore();
  const [newSessionInput, setNewSessionInput] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionInput.trim()) return;
    await createSession(newSessionInput.trim());
    setActiveSessionName(newSessionInput.trim());
    setNewSessionInput('');
    setShowAddForm(false);
  };

  return (
    <div className="w-full max-w-md mx-auto glass-card p-4 rounded-2xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300">Active Session Context</span>
        </div>

        <button
          onClick={() => setBatchScanMode(!batchScanMode)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200"
        >
          <span>Batch Mode</span>
          {batchScanMode ? (
            <ToggleRight className="w-5 h-5 text-cyan-400" />
          ) : (
            <ToggleLeft className="w-5 h-5 text-slate-500" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={activeSessionName}
          onChange={(e) => setActiveSessionName(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
        >
          {sessions.map((s) => (
            <option key={s.id || s.name} value={s.name}>
              {s.name} ({s.scanCount} items)
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl transition-colors shrink-0"
          title="New Session"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateSession} className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder="New session name..."
            value={newSessionInput}
            onChange={(e) => setNewSessionInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-xl transition-colors"
          >
            Create
          </button>
        </form>
      )}
    </div>
  );
};
