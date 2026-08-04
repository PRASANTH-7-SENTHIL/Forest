class AudioAlarmManager {
  private ctx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  public init() {
    if (typeof window !== "undefined" && !this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public playFireAlarm() {
    if (this.isPlaying) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.isPlaying = true;

    try {
      this.oscillator = this.ctx.createOscillator();
      this.gainNode = this.ctx.createGain();

      this.oscillator.type = "sawtooth";
      this.oscillator.frequency.setValueAtTime(880, this.ctx.currentTime);

      this.gainNode.gain.setValueAtTime(0.3, this.ctx.currentTime);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.oscillator.start();

      let toggle = false;
      this.intervalId = setInterval(() => {
        if (this.oscillator && this.ctx) {
          const targetFreq = toggle ? 880 : 1200;
          this.oscillator.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.05);
          toggle = !toggle;
        }
      }, 300);
    } catch (e) {
      console.warn("Audio alarm error:", e);
    }
  }

  public stopAlarm() {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    try {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
    } catch (e) {
      console.warn("Error stopping alarm:", e);
    }
  }
}

export const alarmManager = new AudioAlarmManager();
