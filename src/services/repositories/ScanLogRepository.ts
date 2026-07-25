import { db } from '../db';
import { ScanLog } from '../../types/database';

export class ScanLogRepository {
  static async addLog(log: Omit<ScanLog, 'id'>): Promise<number> {
    return await db.scanLogs.add(log as ScanLog);
  }

  static async getAllLogs(): Promise<ScanLog[]> {
    return await db.scanLogs.orderBy('timestamp').reverse().toArray();
  }

  static async getLogsPaged(offset: number, limit: number): Promise<ScanLog[]> {
    return await db.scanLogs.orderBy('timestamp').reverse().offset(offset).limit(limit).toArray();
  }

  static async countLogs(): Promise<number> {
    return await db.scanLogs.count();
  }

  static async deleteLog(id: number): Promise<void> {
    await db.scanLogs.delete(id);
  }

  static async deleteMultiple(ids: number[]): Promise<void> {
    await db.scanLogs.bulkDelete(ids);
  }

  static async clearAllLogs(): Promise<void> {
    await db.scanLogs.clear();
  }

  static async toggleFavorite(id: number, isFavorite: boolean): Promise<void> {
    await db.scanLogs.update(id, { isFavorite });
  }

  static async updateTags(id: number, tags: string[]): Promise<void> {
    await db.scanLogs.update(id, { tags });
  }

  static async bulkUpdateTags(ids: number[], tags: string[]): Promise<void> {
    await db.transaction('rw', db.scanLogs, async () => {
      for (const id of ids) {
        await db.scanLogs.update(id, { tags });
      }
    });
  }

  static async searchLogs(query: string, sessionName?: string, tag?: string): Promise<ScanLog[]> {
    const q = query.toLowerCase().trim();
    let collection = db.scanLogs.orderBy('timestamp').reverse();
    
    let results = await collection.toArray();
    
    if (sessionName) {
      results = results.filter(item => item.sessionName === sessionName);
    }
    
    if (tag) {
      results = results.filter(item => item.tags && item.tags.includes(tag));
    }
    
    if (q) {
      results = results.filter(item => 
        item.rawContent.toLowerCase().includes(q) ||
        item.parsedType.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q))
      );
    }
    
    return results;
  }
}
