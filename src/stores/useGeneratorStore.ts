import { create } from 'zustand';
import { GeneratorContentType, QRCodeStyleConfig, BarcodeStyleConfig } from '../types/generator';
import { GeneratorHistoryItem, GeneratorTemplate } from '../types/database';
import { GeneratorHistoryRepository } from '../services/repositories/GeneratorHistoryRepository';
import { TemplateRepository } from '../services/repositories/TemplateRepository';

interface GeneratorStore {
  contentType: GeneratorContentType;
  rawContent: string;
  qrStyle: QRCodeStyleConfig;
  barcodeStyle: BarcodeStyleConfig;
  templates: GeneratorTemplate[];
  history: GeneratorHistoryItem[];

  setContentType: (type: GeneratorContentType) => void;
  setRawContent: (content: string) => void;
  setQrStyle: (style: Partial<QRCodeStyleConfig>) => void;
  setBarcodeStyle: (style: Partial<BarcodeStyleConfig>) => void;
  saveToHistory: (title: string) => Promise<void>;
  saveAsTemplate: (title: string) => Promise<void>;
  loadTemplates: () => Promise<void>;
  loadHistory: () => Promise<void>;
  applyTemplate: (template: GeneratorTemplate) => void;
}

const defaultQrStyle: QRCodeStyleConfig = {
  width: 280,
  height: 280,
  margin: 10,
  dotsColor: '#0f172a',
  dotsType: 'square',
  backgroundColor: '#ffffff',
  cornersSquareColor: '#0284c7',
  cornersSquareType: 'square',
  cornersDotColor: '#0369a1',
  cornersDotType: 'square',
  errorCorrectionLevel: 'M'
};

const defaultBarcodeStyle: BarcodeStyleConfig = {
  format: 'CODE128',
  lineColor: '#0f172a',
  background: '#ffffff',
  width: 2,
  height: 100,
  displayValue: true,
  fontSize: 16,
  margin: 10
};

export const useGeneratorStore = create<GeneratorStore>((set, get) => ({
  contentType: 'URL',
  rawContent: 'https://github.com',
  qrStyle: defaultQrStyle,
  barcodeStyle: defaultBarcodeStyle,
  templates: [],
  history: [],

  setContentType: (contentType) => set({ contentType }),
  setRawContent: (rawContent) => set({ rawContent }),
  setQrStyle: (style) => set(state => ({ qrStyle: { ...state.qrStyle, ...style } })),
  setBarcodeStyle: (style) => set(state => ({ barcodeStyle: { ...state.barcodeStyle, ...style } })),

  saveToHistory: async (title) => {
    const { contentType, rawContent, qrStyle, barcodeStyle } = get();
    const item: Omit<GeneratorHistoryItem, 'id'> = {
      title,
      contentType,
      rawContent,
      format: contentType === 'BARCODE' ? barcodeStyle.format : 'QR_CODE',
      styleConfig: contentType === 'BARCODE' ? (barcodeStyle as unknown as Record<string, unknown>) : (qrStyle as unknown as Record<string, unknown>),
      timestamp: Date.now(),
      isFavorite: false
    };

    await GeneratorHistoryRepository.addHistory(item);
    await get().loadHistory();
  },

  saveAsTemplate: async (title) => {
    const { contentType, rawContent, qrStyle, barcodeStyle } = get();
    const tmpl: Omit<GeneratorTemplate, 'id'> = {
      title,
      contentType,
      rawContent,
      format: contentType === 'BARCODE' ? barcodeStyle.format : 'QR_CODE',
      styleConfig: contentType === 'BARCODE' ? (barcodeStyle as unknown as Record<string, unknown>) : (qrStyle as unknown as Record<string, unknown>),
      createdAt: Date.now(),
      isFavorite: false
    };

    await TemplateRepository.addTemplate(tmpl);
    await get().loadTemplates();
  },

  loadTemplates: async () => {
    const templates = await TemplateRepository.getAllTemplates();
    set({ templates });
  },

  loadHistory: async () => {
    const history = await GeneratorHistoryRepository.getAllHistory();
    set({ history });
  },

  applyTemplate: (tmpl) => {
    set({
      contentType: tmpl.contentType as GeneratorContentType,
      rawContent: tmpl.rawContent,
      qrStyle: tmpl.contentType !== 'BARCODE' ? { ...defaultQrStyle, ...tmpl.styleConfig } : defaultQrStyle,
      barcodeStyle: tmpl.contentType === 'BARCODE' ? { ...defaultBarcodeStyle, ...tmpl.styleConfig } : defaultBarcodeStyle
    });
  }
}));
