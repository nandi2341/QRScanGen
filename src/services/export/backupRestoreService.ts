import { ScanLogRepository } from '../repositories/ScanLogRepository';
import { GeneratorHistoryRepository } from '../repositories/GeneratorHistoryRepository';
import { TemplateRepository } from '../repositories/TemplateRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { AppBackupData } from '../../types/database';

export class BackupRestoreService {
  static async exportFullBackup(): Promise<string> {
    const scanLogs = await ScanLogRepository.getAllLogs();
    const generatorHistory = await GeneratorHistoryRepository.getAllHistory();
    const templates = await TemplateRepository.getAllTemplates();
    const sessions = await SessionRepository.getAllSessions();
    const settings = await SettingsRepository.getAllSettings();

    const backupData: AppBackupData = {
      version: '1.0.0',
      exportedAt: Date.now(),
      scanLogs,
      generatorHistory,
      templates,
      sessions,
      settings
    };

    return JSON.stringify(backupData, null, 2);
  }

  static async importFullBackup(jsonString: string, mode: 'MERGE' | 'OVERWRITE' = 'MERGE'): Promise<{ success: boolean; message: string }> {
    try {
      const data: AppBackupData = JSON.parse(jsonString);

      if (!data.version || !Array.isArray(data.scanLogs)) {
        return { success: false, message: 'Invalid backup file format' };
      }

      if (mode === 'OVERWRITE') {
        await ScanLogRepository.clearAllLogs();
        await GeneratorHistoryRepository.clearAll();
      }

      for (const log of data.scanLogs) {
        const { id, ...rest } = log;
        await ScanLogRepository.addLog(rest);
      }

      if (Array.isArray(data.generatorHistory)) {
        for (const item of data.generatorHistory) {
          const { id, ...rest } = item;
          await GeneratorHistoryRepository.addHistory(rest);
        }
      }

      if (Array.isArray(data.templates)) {
        for (const tmpl of data.templates) {
          const { id, ...rest } = tmpl;
          await TemplateRepository.addTemplate(rest);
        }
      }

      if (Array.isArray(data.sessions)) {
        for (const sess of data.sessions) {
          const { id, ...rest } = sess;
          await SessionRepository.addSession(rest);
        }
      }

      if (data.settings && typeof data.settings === 'object') {
        await SettingsRepository.saveAllSettings(data.settings);
      }

      return { success: true, message: `Successfully imported ${data.scanLogs.length} scan logs.` };
    } catch (err) {
      return { success: false, message: `Import error: ${err instanceof Error ? err.message : 'Unknown error'}` };
    }
  }
}
