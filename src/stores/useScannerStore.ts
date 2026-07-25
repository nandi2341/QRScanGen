import { create } from 'zustand';
import { ScanLog, CodeFormat } from '../types/database';
import { ScanLogRepository } from '../services/repositories/ScanLogRepository';
import { SmartParser } from '../services/parser/smartParser';
import { AudioBeepService } from '../services/audio/audioBeepService';
import { useSettingsStore } from './useSettingsStore';

interface ScannerStore {
  isScanning: boolean;
  facingMode: 'environment' | 'user';
  torchOn: boolean;
  lastScannedLog: ScanLog | null;
  showSuccessModal: boolean;
  sessionScanCount: number;
  scanHistorySession: string[];
  
  setIsScanning: (isScanning: boolean) => void;
  setFacingMode: (mode: 'environment' | 'user') => void;
  setTorchOn: (torchOn: boolean) => void;
  closeSuccessModal: () => void;
  processScanResult: (rawContent: string, format?: CodeFormat, source?: 'CAMERA' | 'FILE_IMPORT') => Promise<{ success: boolean; log: ScanLog | null; message?: string }>;
}

let lastProcessedContent: string | null = null;
let lastProcessedTime = 0;
let isProcessingScanLock = false;

export const useScannerStore = create<ScannerStore>((set, get) => ({
  isScanning: false,
  facingMode: 'environment',
  torchOn: false,
  lastScannedLog: null,
  showSuccessModal: false,
  sessionScanCount: 0,
  scanHistorySession: [],

  setIsScanning: (isScanning) => set({ isScanning }),
  setFacingMode: (facingMode) => set({ facingMode }),
  setTorchOn: (torchOn) => set({ torchOn }),
  closeSuccessModal: () => set({ showSuccessModal: false }),

  processScanResult: async (rawContent, format = 'QR_CODE', source = 'CAMERA') => {
    const now = Date.now();

    // Deduplication check: ignore identical content scanned within 15 seconds
    if (source === 'CAMERA' && rawContent === lastProcessedContent && now - lastProcessedTime < 15000) {
      return { success: false, log: null, message: 'Duplicate scan suppressed.' };
    }

    // Lock check: ignore concurrent execution
    if (isProcessingScanLock) {
      return { success: false, log: null, message: 'Scan already in progress.' };
    }

    isProcessingScanLock = true;
    lastProcessedContent = rawContent;
    lastProcessedTime = now;

    try {
      const settings = useSettingsStore.getState();

      // Check duplicate policy
      if (settings.duplicatePolicy === 'IGNORE_IN_SESSION') {
        if (get().scanHistorySession.includes(rawContent)) {
          return { success: false, log: null, message: 'Duplicate scan ignored per session policy.' };
        }
      }

      const parsedResult = SmartParser.parse(rawContent);

      const newLog: Omit<ScanLog, 'id'> = {
        rawContent,
        format,
        parsedType: parsedResult.type,
        parsedData: parsedResult.details,
        timestamp: Date.now(),
        sessionName: settings.activeSessionName || 'Default',
        tags: [parsedResult.type.toLowerCase()],
        isFavorite: false,
        source
      };

      const id = await ScanLogRepository.addLog(newLog);
      const createdLog: ScanLog = { ...newLog, id };

      // Audio & Vibration feedback
      if (settings.soundEnabled) AudioBeepService.playBeep();
      if (settings.vibrationEnabled) AudioBeepService.vibrate(150);

      // Auto copy if enabled
      if (settings.autoCopyOnScan && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(rawContent);
        } catch {
          // Clipboard optional
        }
      }

      set(state => ({
        lastScannedLog: createdLog,
        showSuccessModal: true,
        sessionScanCount: state.sessionScanCount + 1,
        scanHistorySession: [...state.scanHistorySession, rawContent]
      }));

      return { success: true, log: createdLog };
    } finally {
      isProcessingScanLock = false;
    }
  }
}));
