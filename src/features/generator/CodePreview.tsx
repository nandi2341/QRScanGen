import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import JsBarcode from 'jsbarcode';
import { useGeneratorStore } from '../../stores/useGeneratorStore';
import { Download, Save, Star } from 'lucide-react';
import { ExportFormattedService } from '../../services/export/exportFormattedService';

export const CodePreview: React.FC = () => {
  const { contentType, rawContent, qrStyle, barcodeStyle, saveToHistory, saveAsTemplate } = useGeneratorStore();
  const qrRef = useRef<HTMLDivElement | null>(null);
  const barcodeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const qrCodeStylingRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (contentType !== 'BARCODE') {
      if (!qrCodeStylingRef.current) {
        qrCodeStylingRef.current = new QRCodeStyling({
          width: qrStyle.width,
          height: qrStyle.height,
          data: rawContent || 'https://github.com',
          image: qrStyle.logoUrl,
          dotsOptions: {
            color: qrStyle.dotsColor,
            type: qrStyle.dotsType
          },
          backgroundOptions: {
            color: qrStyle.backgroundColor
          },
          cornersSquareOptions: {
            color: qrStyle.cornersSquareColor,
            type: qrStyle.cornersSquareType
          },
          cornersDotOptions: {
            color: qrStyle.cornersDotColor,
            type: qrStyle.cornersDotType
          },
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: qrStyle.logoMargin || 5
          },
          qrOptions: {
            errorCorrectionLevel: qrStyle.errorCorrectionLevel
          }
        });
        if (qrRef.current) {
          qrRef.current.innerHTML = '';
          qrCodeStylingRef.current.append(qrRef.current);
        }
      } else {
        qrCodeStylingRef.current.update({
          width: qrStyle.width,
          height: qrStyle.height,
          data: rawContent || 'https://github.com',
          image: qrStyle.logoUrl,
          dotsOptions: {
            color: qrStyle.dotsColor,
            type: qrStyle.dotsType
          },
          backgroundOptions: {
            color: qrStyle.backgroundColor
          },
          cornersSquareOptions: {
            color: qrStyle.cornersSquareColor,
            type: qrStyle.cornersSquareType
          },
          cornersDotOptions: {
            color: qrStyle.cornersDotColor,
            type: qrStyle.cornersDotType
          },
          qrOptions: {
            errorCorrectionLevel: qrStyle.errorCorrectionLevel
          }
        });
      }
    } else {
      if (barcodeCanvasRef.current && rawContent) {
        try {
          JsBarcode(barcodeCanvasRef.current, rawContent, {
            format: barcodeStyle.format,
            lineColor: barcodeStyle.lineColor,
            background: barcodeStyle.background,
            width: barcodeStyle.width,
            height: barcodeStyle.height,
            displayValue: barcodeStyle.displayValue,
            fontSize: barcodeStyle.fontSize,
            margin: barcodeStyle.margin
          });
        } catch {
          // Barcode parse error
        }
      }
    }
  }, [contentType, rawContent, qrStyle, barcodeStyle]);

  const handleExport = async (ext: 'png' | 'svg' | 'jpg' | 'pdf') => {
    await saveToHistory(`${contentType} Code - ${new Date().toLocaleTimeString()}`);

    if (contentType !== 'BARCODE' && qrCodeStylingRef.current) {
      if (ext === 'pdf') {
        const rawBlob = await qrCodeStylingRef.current.getRawData('png');
        if (rawBlob) {
          const imgUrl = URL.createObjectURL(rawBlob as Blob);
          const img = new Image();
          img.src = imgUrl;
          img.onload = async () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            const pdfBlob = await ExportFormattedService.exportToPDF([], 'QR Code Export');
            ExportFormattedService.downloadFile('qr_code.pdf', pdfBlob, 'application/pdf');
          };
        }
      } else {
        qrCodeStylingRef.current.download({ extension: ext === 'jpg' ? 'jpeg' : ext, name: 'qr_code' });
      }
    } else if (barcodeCanvasRef.current) {
      const dataUrl = barcodeCanvasRef.current.toDataURL(ext === 'jpg' ? 'image/jpeg' : 'image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `barcode.${ext}`;
      a.click();
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center space-y-6">
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-center min-h-[280px] min-w-[280px]">
        {contentType !== 'BARCODE' ? (
          <div ref={qrRef} className="rounded-xl overflow-hidden shadow-xl" />
        ) : (
          <canvas ref={barcodeCanvasRef} className="rounded-xl overflow-hidden shadow-xl max-w-full" />
        )}
      </div>

      {/* Export & Save Buttons */}
      <div className="w-full flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => handleExport('png')}
          className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> PNG
        </button>
        <button
          onClick={() => handleExport('svg')}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> SVG
        </button>
        <button
          onClick={() => handleExport('jpg')}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> JPG
        </button>
        <button
          onClick={() => handleExport('pdf')}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> PDF
        </button>
        <button
          onClick={() => saveAsTemplate(`Template ${contentType} ${Date.now().toString().slice(-4)}`)}
          className="px-3.5 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Star className="w-3.5 h-3.5" /> Save Template
        </button>
      </div>
    </div>
  );
};
