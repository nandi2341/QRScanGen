export class AudioBeepService {
  private static audioCtx: AudioContext | null = null;

  static playBeep(frequency = 880, durationMs = 150): void {
    try {
      if (!AudioBeepService.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        AudioBeepService.audioCtx = new AudioContextClass();
      }

      if (AudioBeepService.audioCtx.state === 'suspended') {
        AudioBeepService.audioCtx.resume();
      }

      const osc = AudioBeepService.audioCtx.createOscillator();
      const gain = AudioBeepService.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, AudioBeepService.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.15, AudioBeepService.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, AudioBeepService.audioCtx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(AudioBeepService.audioCtx.destination);

      osc.start();
      osc.stop(AudioBeepService.audioCtx.currentTime + durationMs / 1000);
    } catch {
      // Audio playback suppressed or unsupported
    }
  }

  static vibrate(pattern: number | number[] = 200): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Suppress
      }
    }
  }
}
