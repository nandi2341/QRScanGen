import React, { useEffect } from 'react';
import { useScannerStore } from '../../stores/useScannerStore';
import { CheckCircle2, Copy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ScanSuccessModal: React.FC = () => {
  const { lastScannedLog, showSuccessModal, closeSuccessModal } = useScannerStore();

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        closeSuccessModal();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, closeSuccessModal]);

  if (!showSuccessModal || !lastScannedLog) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lastScannedLog.rawContent);
    } catch {
      // Ignore
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="w-full max-w-sm glass-panel p-5 rounded-3xl border border-cyan-500/40 shadow-2xl space-y-4 text-center"
        >
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <h3 className="font-bold text-slate-100 text-sm">QR berhasil dipindai</h3>
            <p className="text-xs text-slate-400 mt-0.5">Data telah disimpan ke Log.</p>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-left max-h-24 overflow-y-auto">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              {lastScannedLog.parsedType} ({lastScannedLog.format})
            </span>
            <p className="text-xs text-slate-200 font-mono break-all">{lastScannedLog.rawContent}</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
            <button
              onClick={closeSuccessModal}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Continue Scanning
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
