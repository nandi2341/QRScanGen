import { create } from 'zustand';

interface UIStore {
  isOffline: boolean;
  isPwaInstallable: boolean;
  deferredPrompt: unknown;
  activeModal: string | null;
  toastMessage: string | null;

  setIsOffline: (isOffline: boolean) => void;
  setPwaInstallable: (installable: boolean, prompt?: unknown) => void;
  openModal: (modalName: string) => void;
  closeModal: () => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
  isPwaInstallable: false,
  deferredPrompt: null,
  activeModal: null,
  toastMessage: null,

  setIsOffline: (isOffline) => set({ isOffline }),
  setPwaInstallable: (isPwaInstallable, deferredPrompt = null) => set({ isPwaInstallable, deferredPrompt }),
  openModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null }),
  showToast: (toastMessage) => set({ toastMessage }),
  clearToast: () => set({ toastMessage: null })
}));
