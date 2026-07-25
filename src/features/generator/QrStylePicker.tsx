import React from 'react';
import { useGeneratorStore } from '../../stores/useGeneratorStore';
import { Palette, Layers, Image as ImageIcon } from 'lucide-react';

export const QrStylePicker: React.FC = () => {
  const { qrStyle, setQrStyle, contentType } = useGeneratorStore();

  if (contentType === 'BARCODE') return null;

  const dotTypes: ('square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded')[] = [
    'square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'
  ];

  const cornerTypes: ('square' | 'dot' | 'extra-rounded')[] = ['square', 'dot', 'extra-rounded'];

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 text-xs">
      <div className="flex items-center gap-2 text-cyan-400 font-bold">
        <Palette className="w-4 h-4" />
        <span>QR Custom Styling & Aesthetics</span>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-slate-400 font-medium block mb-1">Dots Color</label>
          <input
            type="color"
            value={qrStyle.dotsColor}
            onChange={(e) => setQrStyle({ dotsColor: e.target.value })}
            className="w-full h-8 rounded-lg cursor-pointer bg-slate-900 border border-slate-700"
          />
        </div>
        <div>
          <label className="text-slate-400 font-medium block mb-1">Background</label>
          <input
            type="color"
            value={qrStyle.backgroundColor}
            onChange={(e) => setQrStyle({ backgroundColor: e.target.value })}
            className="w-full h-8 rounded-lg cursor-pointer bg-slate-900 border border-slate-700"
          />
        </div>
        <div>
          <label className="text-slate-400 font-medium block mb-1">Corner Frame</label>
          <input
            type="color"
            value={qrStyle.cornersSquareColor}
            onChange={(e) => setQrStyle({ cornersSquareColor: e.target.value })}
            className="w-full h-8 rounded-lg cursor-pointer bg-slate-900 border border-slate-700"
          />
        </div>
      </div>

      {/* Dot & Corner Styles */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 font-medium block mb-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Dots Pattern
          </label>
          <select
            value={qrStyle.dotsType}
            onChange={(e) => setQrStyle({ dotsType: e.target.value as unknown as typeof qrStyle.dotsType })}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            {dotTypes.map((dt) => (
              <option key={dt} value={dt}>
                {dt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-slate-400 font-medium block mb-1">Corner Frames</label>
          <select
            value={qrStyle.cornersSquareType}
            onChange={(e) => setQrStyle({ cornersSquareType: e.target.value as unknown as typeof qrStyle.cornersSquareType })}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            {cornerTypes.map((ct) => (
              <option key={ct} value={ct}>
                {ct}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logo Overlay & Error Correction */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div>
          <label className="text-slate-400 font-medium block mb-1 flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5" /> Center Logo Image URL
          </label>
          <input
            type="text"
            placeholder="https://..."
            value={qrStyle.logoUrl || ''}
            onChange={(e) => setQrStyle({ logoUrl: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-slate-400 font-medium block mb-1">Error Correction</label>
          <select
            value={qrStyle.errorCorrectionLevel}
            onChange={(e) => setQrStyle({ errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' })}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            <option value="L">L (7% Recovery)</option>
            <option value="M">M (15% Recovery)</option>
            <option value="Q">Q (25% Recovery)</option>
            <option value="H">H (30% Recovery)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
