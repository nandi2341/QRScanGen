import React, { useEffect } from 'react';
import { useUIStore } from '../stores/useUIStore';
import { Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast: React.FC = () => {
  const { toastMessage, clearToast } = useUIStore();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-20 right-4 z-50 max-w-sm glass-panel p-4 rounded-xl border border-cyan-500/30 text-slate-100 shadow-2xl flex items-center gap-3"
        >
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium leading-snug flex-1">{toastMessage}</p>
          <button
            onClick={clearToast}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
