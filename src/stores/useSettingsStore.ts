import { create } from 'zustand';
import { SettingsState } from '../types/database';
import { SettingsRepository } from '../services/repositories/SettingsRepository';

interface SettingsStore extends SettingsState {
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setLanguage: (lang: 'en' | 'id') => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  setDuplicatePolicy: (policy: 'ALLOW' | 'IGNORE_IN_SESSION' | 'ALERT') => void;
  setAutoCopyOnScan: (enabled: boolean) => void;
  setBatchScanMode: (enabled: boolean) => void;
  setActiveSessionName: (name: string) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  theme: 'dark',
  language: 'en',
  soundEnabled: true,
  vibrationEnabled: true,
  duplicatePolicy: 'ALLOW',
  autoCopyOnScan: false,
  activeSessionName: 'Default',
  batchScanMode: true,
  hasCompletedOnboarding: false,

  setTheme: (theme) => {
    set({ theme });
    SettingsRepository.setSetting('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  },

  setLanguage: (language) => {
    set({ language });
    SettingsRepository.setSetting('language', language);
  },

  setSoundEnabled: (soundEnabled) => {
    set({ soundEnabled });
    SettingsRepository.setSetting('soundEnabled', soundEnabled);
  },

  setVibrationEnabled: (vibrationEnabled) => {
    set({ vibrationEnabled });
    SettingsRepository.setSetting('vibrationEnabled', vibrationEnabled);
  },

  setDuplicatePolicy: (duplicatePolicy) => {
    set({ duplicatePolicy });
    SettingsRepository.setSetting('duplicatePolicy', duplicatePolicy);
  },

  setAutoCopyOnScan: (autoCopyOnScan) => {
    set({ autoCopyOnScan });
    SettingsRepository.setSetting('autoCopyOnScan', autoCopyOnScan);
  },

  setBatchScanMode: (batchScanMode) => {
    set({ batchScanMode });
    SettingsRepository.setSetting('batchScanMode', batchScanMode);
  },

  setActiveSessionName: (activeSessionName) => {
    set({ activeSessionName });
    SettingsRepository.setSetting('activeSessionName', activeSessionName);
  },

  setHasCompletedOnboarding: (hasCompletedOnboarding) => {
    set({ hasCompletedOnboarding });
    SettingsRepository.setSetting('hasCompletedOnboarding', hasCompletedOnboarding);
  },

  loadSettings: async () => {
    const theme = await SettingsRepository.getSetting<'dark' | 'light' | 'system'>('theme', 'dark');
    const language = await SettingsRepository.getSetting<'en' | 'id'>('language', 'en');
    const soundEnabled = await SettingsRepository.getSetting<boolean>('soundEnabled', true);
    const vibrationEnabled = await SettingsRepository.getSetting<boolean>('vibrationEnabled', true);
    const duplicatePolicy = await SettingsRepository.getSetting<'ALLOW' | 'IGNORE_IN_SESSION' | 'ALERT'>('duplicatePolicy', 'ALLOW');
    const autoCopyOnScan = await SettingsRepository.getSetting<boolean>('autoCopyOnScan', false);
    const activeSessionName = await SettingsRepository.getSetting<string>('activeSessionName', 'Default');
    const batchScanMode = await SettingsRepository.getSetting<boolean>('batchScanMode', true);
    const hasCompletedOnboarding = await SettingsRepository.getSetting<boolean>('hasCompletedOnboarding', false);

    set({
      theme,
      language,
      soundEnabled,
      vibrationEnabled,
      duplicatePolicy,
      autoCopyOnScan,
      activeSessionName,
      batchScanMode,
      hasCompletedOnboarding
    });

    get().setTheme(theme);
  }
}));
