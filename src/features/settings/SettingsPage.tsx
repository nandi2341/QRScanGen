import React, { useState } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { Moon, Sun, Volume2, VolumeX, Vibrate, ShieldAlert, Keyboard, Check, Info } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    theme,
    language,
    soundEnabled,
    vibrationEnabled,
    duplicatePolicy,
    autoCopyOnScan,
    setTheme,
    setLanguage,
    setSoundEnabled,
    setVibrationEnabled,
    setDuplicatePolicy,
    setAutoCopyOnScan
  } = useSettingsStore();

  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          Preferences & Settings
        </h2>

        {/* UI Theme */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-200 block">Appearance Theme</span>
            <span className="text-[11px] text-slate-400">Switch between dark and light aesthetics</span>
          </div>

          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => setTheme('dark')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                theme === 'dark' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              <Moon className="w-3.5 h-3.5" /> Dark
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                theme === 'light' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Light
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-200 block">Language</span>
            <span className="text-[11px] text-slate-400">Select application interface language</span>
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'id')}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="en">English</option>
            <option value="id">Bahasa Indonesia</option>
          </select>
        </div>

        {/* Sound & Vibration */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-200 block">Audio Beep Feedback</span>
            <span className="text-[11px] text-slate-400">Play Web Audio beep sound on successful scan</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-200 block">Haptic Vibration</span>
            <span className="text-[11px] text-slate-400">Vibrate mobile device on scan</span>
          </div>

          <button
            onClick={() => setVibrationEnabled(!vibrationEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              vibrationEnabled ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Vibrate className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate Policy */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-200 block flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" /> Duplicate Handling Policy
            </span>
            <span className="text-[11px] text-slate-400">Specify how repeated scans in batch mode are handled</span>
          </div>

          <select
            value={duplicatePolicy}
            onChange={(e) => setDuplicatePolicy(e.target.value as unknown as typeof duplicatePolicy)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="ALLOW">Allow All Duplicates</option>
            <option value="IGNORE_IN_SESSION">Ignore Duplicates in Session</option>
            <option value="ALERT">Alert User on Duplicate</option>
          </select>
        </div>

        {/* Keyboard Shortcuts Dialog Opener */}
        <div className="pt-2">
          <button
            onClick={() => setShowShortcutsModal(true)}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Keyboard className="w-4 h-4 text-cyan-400" /> Desktop Keyboard Shortcuts Reference
          </button>
        </div>
      </div>

      {/* Shortcuts Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-cyan-400" /> Keyboard Shortcuts
              </h3>
              <button onClick={() => setShowShortcutsModal(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300 font-medium">Start / Pause Scanner</span>
                <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded font-mono text-cyan-400">Space</kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300 font-medium">Focus Search in Logs</span>
                <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded font-mono text-cyan-400">Ctrl + F</kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300 font-medium">Export Logs</span>
                <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded font-mono text-cyan-400">Ctrl + E</kbd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300 font-medium">Go to Scanner</span>
                <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded font-mono text-cyan-400">Ctrl + S</kbd>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-300 font-medium">Go to Generator</span>
                <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded font-mono text-cyan-400">Ctrl + G</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
