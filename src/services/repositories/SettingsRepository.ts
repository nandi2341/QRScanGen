import { db } from '../db';

export class SettingsRepository {
  static async getSetting<T>(key: string, defaultValue: T): Promise<T> {
    const record = await db.settingsStore.get(key);
    if (!record) return defaultValue;
    return record.value as T;
  }

  static async setSetting<T>(key: string, value: T): Promise<void> {
    await db.settingsStore.put({ key, value });
  }

  static async getAllSettings(): Promise<Record<string, unknown>> {
    const records = await db.settingsStore.toArray();
    const result: Record<string, unknown> = {};
    for (const r of records) {
      result[r.key] = r.value;
    }
    return result;
  }

  static async saveAllSettings(settings: Record<string, unknown>): Promise<void> {
    await db.transaction('rw', db.settingsStore, async () => {
      for (const [key, value] of Object.entries(settings)) {
        await db.settingsStore.put({ key, value });
      }
    });
  }
}
