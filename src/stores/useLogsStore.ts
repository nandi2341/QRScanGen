import { create } from 'zustand';
import { ScanLog } from '../types/database';
import { ScanLogRepository } from '../services/repositories/ScanLogRepository';

interface LogsStore {
  logs: ScanLog[];
  searchQuery: string;
  selectedTag: string | null;
  selectedSession: string | null;
  selectedIds: number[];
  selectedLogDetail: ScanLog | null;
  isLoading: boolean;

  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setSelectedSession: (session: string | null) => void;
  setSelectedLogDetail: (log: ScanLog | null) => void;
  toggleSelectId: (id: number) => void;
  selectAll: () => void;
  clearSelection: () => void;
  loadLogs: () => Promise<void>;
  deleteSelected: () => Promise<void>;
  bulkAddTag: (tag: string) => Promise<void>;
  toggleFavorite: (id: number, current: boolean) => Promise<void>;
}

export const useLogsStore = create<LogsStore>((set, get) => ({
  logs: [],
  searchQuery: '',
  selectedTag: null,
  selectedSession: null,
  selectedIds: [],
  selectedLogDetail: null,
  isLoading: false,

  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    get().loadLogs();
  },

  setSelectedTag: (selectedTag) => {
    set({ selectedTag });
    get().loadLogs();
  },

  setSelectedSession: (selectedSession) => {
    set({ selectedSession });
    get().loadLogs();
  },

  setSelectedLogDetail: (selectedLogDetail) => set({ selectedLogDetail }),

  toggleSelectId: (id) => {
    const { selectedIds } = get();
    if (selectedIds.includes(id)) {
      set({ selectedIds: selectedIds.filter(item => item !== id) });
    } else {
      set({ selectedIds: [...selectedIds, id] });
    }
  },

  selectAll: () => {
    const { logs } = get();
    const ids = logs.map(l => l.id!).filter(Boolean);
    set({ selectedIds: ids });
  },

  clearSelection: () => set({ selectedIds: [] }),

  loadLogs: async () => {
    set({ isLoading: true });
    const { searchQuery, selectedSession, selectedTag } = get();
    const logs = await ScanLogRepository.searchLogs(searchQuery, selectedSession || undefined, selectedTag || undefined);
    set({ logs, isLoading: false });
  },

  deleteSelected: async () => {
    const { selectedIds } = get();
    if (selectedIds.length === 0) return;
    await ScanLogRepository.deleteMultiple(selectedIds);
    set({ selectedIds: [] });
    await get().loadLogs();
  },

  bulkAddTag: async (tag) => {
    const { selectedIds } = get();
    if (selectedIds.length === 0 || !tag.trim()) return;
    
    const { logs } = get();
    for (const id of selectedIds) {
      const existingLog = logs.find(l => l.id === id);
      if (existingLog) {
        const currentTags = existingLog.tags || [];
        if (!currentTags.includes(tag)) {
          await ScanLogRepository.updateTags(id, [...currentTags, tag.trim()]);
        }
      }
    }
    await get().loadLogs();
  },

  toggleFavorite: async (id, current) => {
    await ScanLogRepository.toggleFavorite(id, !current);
    await get().loadLogs();
  }
}));
