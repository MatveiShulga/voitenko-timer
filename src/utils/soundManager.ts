export type SoundType = 'workStart' | 'rest' | 'preparation' | 'setEnd' | 'completion' | 'workAfterRest' | 'beforeNewSet' | 'tick';

class SoundManager {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private isEnabled: boolean = true;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.loadSounds();
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Failed to initialize AudioContext', error);
    }
  }

  private loadSounds() {
    const soundFiles: Record<Exclude<SoundType, 'tick'>, string> = {
      workStart: '/sounds/shaaa2.MP3',
      rest: '/sounds/otdih.MP3',
      preparation: '/sounds/soberis.MP3',
      setEnd: '/sounds/krasivo.MP3',
      completion: '/sounds/krasivo.MP3',
      workAfterRest: '/sounds/poehali.MP3',
      beforeNewSet: '/sounds/vosvrat.MP3',
    };

    Object.entries(soundFiles).forEach(([type, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds.set(type as SoundType, audio);
    });
  }

  private playTick() {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Failed to play tick sound', error);
    }
  }

  async play(type: SoundType) {
    if (!this.isEnabled) return;

    if (type === 'tick') {
      this.playTick();
      return;
    }

    const sound = this.sounds.get(type);
    if (sound) {
      try {
        sound.currentTime = 0;
        await sound.play();
      } catch (error) {
        console.warn(`Failed to play sound: ${type}`, error);
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  getEnabled() {
    return this.isEnabled;
  }
}

export const soundManager = new SoundManager();
