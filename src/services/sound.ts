// Web Audio API Retro Sound Engine

class RetroSoundEngine {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  public beep(freq = 600, duration = 40, type: OscillatorType = 'square') {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration / 1000);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration / 1000);
    } catch {
      // AudioContext policy safe catch
    }
  }

  public typewriterTick() {
    if (this.muted) return;
    this.beep(850 + Math.random() * 300, 12, 'square');
  }

  public connectionChime() {
    if (this.muted) return;
    this.init();
    const freqs = [1200, 2400, 900, 1800, 2100, 1500];
    freqs.forEach((f, i) => setTimeout(() => this.beep(f, 60, 'sawtooth'), i * 70));
  }

  public errorTone() {
    if (this.muted) return;
    this.beep(220, 120, 'sawtooth');
    setTimeout(() => this.beep(180, 160, 'sawtooth'), 100);
  }
}

export const soundEngine = new RetroSoundEngine();
