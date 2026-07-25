import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, Flashlight, RefreshCw, AlertCircle } from 'lucide-react';
import { useScannerStore } from '../../stores/useScannerStore';

interface Props {
  onScanSuccess: (decodedText: string, formatName?: string) => void;
}

export const CameraScanner: React.FC<Props> = ({ onScanSuccess }) => {
  const { facingMode, torchOn, setFacingMode, setTorchOn, setIsScanning } = useScannerStore();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let html5Qrcode: Html5Qrcode | null = null;
    const scannerId = 'qr-reader';

    const startScanner = async () => {
      try {
        setIsInitializing(true);
        setCameraError(null);
        
        html5Qrcode = new Html5Qrcode(scannerId, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.ITF,
            Html5QrcodeSupportedFormats.DATA_MATRIX,
            Html5QrcodeSupportedFormats.PDF_417
          ],
          verbose: false
        });
        scannerRef.current = html5Qrcode;

        await html5Qrcode.start(
          { facingMode },
          {
            fps: 15,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText, decodedResult) => {
            const formatName = decodedResult?.result?.format?.formatName || 'QR_CODE';
            onScanSuccess(decodedText, formatName);
          },
          () => {
            // Frame scan failure - ignore
          }
        );

        setIsScanning(true);
        setIsInitializing(false);
      } catch (err) {
        setCameraError(err instanceof Error ? err.message : 'Camera access denied or unavailable.');
        setIsInitializing(false);
        setIsScanning(false);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {}).finally(() => {
          setIsScanning(false);
        });
      }
    };
  }, [facingMode, onScanSuccess, setIsScanning]);

  const toggleCamera = () => {
    setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
  };

  const toggleTorch = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        const nextTorch = !torchOn;
        await scannerRef.current.applyVideoConstraints({
          advanced: [{ torch: nextTorch } as unknown as MediaTrackConstraints]
        });
        setTorchOn(nextTorch);
      } catch {
        // Torch unsupported
      }
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl flex flex-col items-center justify-center">
      <div id="qr-reader" className="w-full h-full object-cover"></div>

      {isInitializing && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-cyan-400">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span className="text-xs font-medium text-slate-300">Initializing Camera...</span>
        </div>
      )}

      {cameraError && (
        <div className="absolute inset-0 bg-slate-950/90 p-6 flex flex-col items-center justify-center text-center gap-3 text-rose-400">
          <AlertCircle className="w-10 h-10" />
          <h3 className="font-bold text-slate-100">Camera Unavailable</h3>
          <p className="text-xs text-slate-400">{cameraError}</p>
          <p className="text-[11px] text-slate-500">Please allow camera permissions or try File Import below.</p>
        </div>
      )}

      {/* Reticle Scanner Overlay */}
      {!isInitializing && !cameraError && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-cyan-400/80 rounded-3xl relative shadow-[0_0_30px_rgba(56,189,248,0.2)]">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-xl"></div>
            <div className="w-full h-0.5 bg-cyan-400/70 shadow-[0_0_12px_#38bdf8] animate-pulse relative top-1/2"></div>
          </div>
        </div>
      )}

      {/* Camera Controls Bar */}
      {!cameraError && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 rounded-2xl flex items-center gap-4 z-20 border border-slate-700/50">
          <button
            onClick={toggleTorch}
            className={`p-2 rounded-xl transition-colors ${torchOn ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
            title="Toggle Flashlight"
          >
            <Flashlight className="w-5 h-5" />
          </button>

          <button
            onClick={toggleCamera}
            className="p-2 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors"
            title="Switch Camera"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
