export type CodeFormat = 
  | 'QR_CODE'
  | 'CODE_128'
  | 'CODE128'
  | 'EAN_13'
  | 'EAN13'
  | 'EAN_8'
  | 'EAN8'
  | 'UPC_A'
  | 'UPC'
  | 'CODE_39'
  | 'CODE39'
  | 'ITF'
  | 'MSI'
  | 'PHARMACODE'
  | 'DATA_MATRIX'
  | 'PDF_417';

export interface ScanLog {
  id?: number;
  rawContent: string;
  format: CodeFormat;
  parsedType: string;
  parsedData?: Record<string, unknown>;
  timestamp: number;
  sessionName?: string;
  tags: string[];
  isFavorite: boolean;
  notes?: string;
  source: 'CAMERA' | 'FILE_IMPORT';
}

export interface GeneratorHistoryItem {
  id?: number;
  title: string;
  contentType: string;
  rawContent: string;
  format: CodeFormat;
  styleConfig: Record<string, unknown>;
  timestamp: number;
  isFavorite: boolean;
}

export interface GeneratorTemplate {
  id?: number;
  title: string;
  contentType: string;
  rawContent: string;
  format: CodeFormat;
  styleConfig: Record<string, unknown>;
  createdAt: number;
  isFavorite: boolean;
}

export interface ScanSession {
  id?: number;
  name: string;
  createdAt: number;
  scanCount: number;
  description?: string;
  color?: string;
}

export interface SettingsState {
  theme: 'dark' | 'light' | 'system';
  language: 'en' | 'id';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  duplicatePolicy: 'ALLOW' | 'IGNORE_IN_SESSION' | 'ALERT';
  autoCopyOnScan: boolean;
  activeSessionName: string;
  batchScanMode: boolean;
  hasCompletedOnboarding: boolean;
}

export interface AppBackupData {
  version: string;
  exportedAt: number;
  scanLogs: ScanLog[];
  generatorHistory: GeneratorHistoryItem[];
  templates: GeneratorTemplate[];
  sessions: ScanSession[];
  settings: Partial<SettingsState>;
}
