import { create } from 'zustand';
import { ScanSession } from '../types/database';
import { SessionRepository } from '../services/repositories/SessionRepository';

interface SessionStore {
  sessions: ScanSession[];
  activeSession: ScanSession | null;
  loadSessions: () => Promise<void>;
  createSession: (name: string, description?: string) => Promise<void>;
  deleteSession: (id: number) => Promise<void>;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  activeSession: null,

  loadSessions: async () => {
    let sessions = await SessionRepository.getAllSessions();
    if (sessions.length === 0) {
      await SessionRepository.addSession({
        name: 'Default',
        createdAt: Date.now(),
        scanCount: 0,
        description: 'Default scan session'
      });
      sessions = await SessionRepository.getAllSessions();
    }
    set({ sessions, activeSession: sessions[0] || null });
  },

  createSession: async (name, description) => {
    if (!name.trim()) return;
    await SessionRepository.addSession({
      name: name.trim(),
      createdAt: Date.now(),
      scanCount: 0,
      description
    });
    await get().loadSessions();
  },

  deleteSession: async (id) => {
    await SessionRepository.deleteSession(id);
    await get().loadSessions();
  }
}));
