import React, { useEffect } from 'react';
import { useUIStore } from '../stores/useUIStore';
import { WifiOff } from 'lucide-react';

export const OfflineBadge: React.FC = () => {
  const { isOffline, setIsOffline } = useUIStore();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setIsOffline]);

  if (!isOffline) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-3 py-1 bg-amber-500/10 border border-amber-500/30 backdrop-blur-md rounded-full flex items-center gap-2 text-xs font-medium text-amber-400 shadow-lg">
      <WifiOff className="w-3.5 h-3.5" />
      <span>Offline Mode — All local features active</span>
    </div>
  );
};
