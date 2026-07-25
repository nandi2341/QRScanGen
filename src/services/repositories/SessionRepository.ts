import { db } from '../db';
import { ScanSession } from '../../types/database';

export class SessionRepository {
  static async addSession(session: Omit<ScanSession, 'id'>): Promise<number> {
    return await db.sessions.add(session as ScanSession);
  }

  static async getAllSessions(): Promise<ScanSession[]> {
    return await db.sessions.orderBy('createdAt').reverse().toArray();
  }

  static async incrementScanCount(sessionName: string): Promise<void> {
    const existing = await db.sessions.where('name').equals(sessionName).first();
    if (existing && existing.id) {
      await db.sessions.update(existing.id, { scanCount: existing.scanCount + 1 });
    }
  }

  static async deleteSession(id: number): Promise<void> {
    await db.sessions.delete(id);
  }
}
