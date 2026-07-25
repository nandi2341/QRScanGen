import React, { useCallback } from 'react';
import { CameraScanner } from './CameraScanner';
import { FileImportScanner } from './FileImportScanner';
import { BatchSessionControls } from './BatchSessionControls';
import { ScanSuccessModal } from './ScanSuccessModal';
import { useScannerStore } from '../../stores/useScannerStore';
import { CodeFormat } from '../../types/database';

export const ScannerPage: React.FC = () => {
  const { processScanResult, sessionScanCount } = useScannerStore();

  const handleScanSuccess = useCallback(async (rawContent: string, formatName?: string) => {
    await processScanResult(rawContent, (formatName as CodeFormat) || 'QR_CODE', 'CAMERA');
  }, [processScanResult]);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Session & Batch controls */}
      <BatchSessionControls />

      {/* Camera Live Scanner */}
      <CameraScanner onScanSuccess={handleScanSuccess} />

      {/* File Import Scanner */}
      <FileImportScanner onScanSuccess={(raw) => processScanResult(raw, 'QR_CODE', 'FILE_IMPORT')} />

      {/* Scan Counter Banner */}
      <div className="text-center">
        <span className="text-xs text-slate-400 font-medium">
          Scanned in this session: <strong className="text-cyan-400 font-bold">{sessionScanCount}</strong>
        </span>
      </div>

      <ScanSuccessModal />
    </div>
  );
};

export default ScannerPage;
