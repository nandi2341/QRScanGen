import React, { useEffect } from 'react';
import { useGeneratorStore } from '../../stores/useGeneratorStore';
import { Bookmark, Star, Trash2 } from 'lucide-react';
import { TemplateRepository } from '../../services/repositories/TemplateRepository';

export const TemplateManager: React.FC = () => {
  const { templates, loadTemplates, applyTemplate } = useGeneratorStore();

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  if (templates.length === 0) return null;

  const handleDelete = async (id: number) => {
    await TemplateRepository.deleteTemplate(id);
    await loadTemplates();
  };

  return (
    <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-3">
      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
        <Bookmark className="w-4 h-4" />
        <span>Saved Generator Templates</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-2.5 rounded-2xl shrink-0 text-xs space-y-2 w-40"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 truncate max-w-[100px]">{tmpl.title}</span>
              <button
                onClick={() => tmpl.id && handleDelete(tmpl.id)}
                className="text-slate-500 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[10px] text-slate-400">
              <span className="px-1.5 py-0.5 bg-slate-800 rounded font-medium">{tmpl.contentType}</span>
            </div>
            <button
              onClick={() => applyTemplate(tmpl)}
              className="w-full py-1 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 font-medium text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <Star className="w-3 h-3" /> Load
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
