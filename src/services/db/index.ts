import Dexie, { Table } from 'dexie';
import { ScanLog, GeneratorHistoryItem, GeneratorTemplate, ScanSession } from '../../types/database';

export class QRProDatabase extends Dexie {
  scanLogs!: Table<ScanLog, number>;
  generatorHistory!: Table<GeneratorHistoryItem, number>;
  templates!: Table<GeneratorTemplate, number>;
  sessions!: Table<ScanSession, number>;
  settingsStore!: Table<{ key: string; value: unknown }, string>;

  constructor() {
    super('QRProDatabase');
    
    this.version(1).stores({
      scanLogs: '++id, timestamp, format, parsedType, sessionName, isFavorite, *tags',
      generatorHistory: '++id, timestamp, contentType, format, isFavorite',
      templates: '++id, createdAt, contentType, isFavorite',
      sessions: '++id, name, createdAt',
      settingsStore: 'key'
    });
  }
}

export const db = new QRProDatabase();
