export type SoundType = 'work' | 'rest' | 'preparation' | 'setEnd' | 'completion';

class SoundManager {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private isEnabled: boolean = true;

  constructor() {
    this.loadSounds();
  }

  private loadSounds() {
    const soundFiles: Record<SoundType, string> = {
      work: '/sounds/sound1.mp3',
      rest: '/sounds/sound2.mp3',
      preparation: '/sounds/sound3.mp3',
      setEnd: '/sounds/sound4.mp3',
      completion: '/sounds/sound5.mp3',
    };

    Object.entries(soundFiles).forEach(([type, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds.set(type as SoundType, audio);
    });
  }

  async play(type: SoundType) {
    if (!this.isEnabled) return;

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
