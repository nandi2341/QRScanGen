import React, { useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Upload, FileImage, AlertTriangle } from 'lucide-react';

interface Props {
  onScanSuccess: (decodedText: string, formatName?: string) => void;
}

export const FileImportScanner: React.FC<Props> = ({ onScanSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setError(null);

      const html5Qrcode = new Html5Qrcode('file-scanner-temp');
      const result = await html5Qrcode.scanFile(file, true);
      
      onScanSuccess(result, 'QR_CODE');
      setIsProcessing(false);
    } catch {
      setError('Could not detect a valid QR or Barcode in the selected image.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-3">
      <div id="file-scanner-temp" className="hidden"></div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        {isProcessing ? (
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Upload className="w-4 h-4 text-cyan-400" />
        )}
        <span>Scan QR / Barcode from Image File (PNG, JPG, WEBP)</span>
      </button>

      {error && (
        <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
