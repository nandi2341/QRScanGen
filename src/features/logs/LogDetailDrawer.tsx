import React, { useState } from 'react';
import { useLogsStore } from '../../stores/useLogsStore';
import { useGeneratorStore } from '../../stores/useGeneratorStore';
import { useNavigate } from 'react-router-dom';
import { SmartParser } from '../../services/parser/smartParser';
import { X, Copy, Share2, QrCode, Tag as TagIcon, FileText } from 'lucide-react';
import { ScanLogRepository } from '../../services/repositories/ScanLogRepository';

export const LogDetailDrawer: React.FC = () => {
  const { selectedLogDetail, setSelectedLogDetail, loadLogs } = useLogsStore();
  const { setRawContent, setContentType } = useGeneratorStore();
  const navigate = useNavigate();

  const [tagInput, setTagInput] = useState('');
  const [notesInput, setNotesInput] = useState(selectedLogDetail?.notes || '');

  if (!selectedLogDetail) return null;

  const parsed = SmartParser.parse(selectedLogDetail.rawContent);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedLogDetail.rawContent);
    } catch {
      // Ignore
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Scan: ${selectedLogDetail.parsedType}`,
          text: selectedLogDetail.rawContent
        });
      } catch {
        // Ignore
      }
    }
  };

  const handleRegenerate = () => {
    setRawContent(selectedLogDetail.rawContent);
    setContentType(selectedLogDetail.parsedType === 'WIFI' ? 'WIFI' : selectedLogDetail.parsedType === 'VCARD' ? 'VCARD' : 'URL');
    setSelectedLogDetail(null);
    navigate('/generator');
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim() || !selectedLogDetail.id) return;
    const currentTags = selectedLogDetail.tags || [];
    if (!currentTags.includes(tagInput.trim())) {
      await ScanLogRepository.updateTags(selectedLogDetail.id, [...currentTags, tagInput.trim()]);
      await loadLogs();
      setSelectedLogDetail({ ...selectedLogDetail, tags: [...currentTags, tagInput.trim()] });
    }
    setTagInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-950 border-l border-slate-800 p-6 h-full overflow-y-auto space-y-6 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-bold uppercase">
              {parsed.type}
            </span>
            <span className="text-xs font-semibold text-slate-300">{selectedLogDetail.format}</span>
          </div>

          <button
            onClick={() => setSelectedLogDetail(null)}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Parsed Inspector Fields */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parsed Inspector</h4>
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2.5">
            {parsed.displayFields?.map((f) => (
              <div key={f.label} className="text-xs space-y-0.5">
                <span className="text-[11px] font-semibold text-slate-400">{f.label}:</span>
                <p className={`font-mono break-all ${f.isLink ? 'text-cyan-400 underline' : 'text-slate-200'}`}>
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Raw Content */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Raw Payload</h4>
          <pre className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap break-all max-h-36 overflow-y-auto">
            {selectedLogDetail.rawContent}
          </pre>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleCopy}
            className="py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
          <button
            onClick={handleShare}
            className="py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button
            onClick={handleRegenerate}
            className="py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" /> Re-Generate
          </button>
        </div>

        {/* Tag Manager */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TagIcon className="w-3.5 h-3.5 text-cyan-400" /> Tagging
          </h4>
          <form onSubmit={handleAddTag} className="flex gap-2">
            <input
              type="text"
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
            />
            <button type="submit" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl">
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
