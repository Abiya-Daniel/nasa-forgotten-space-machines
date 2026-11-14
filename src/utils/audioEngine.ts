import { SoundEffectId } from '../data/mediaData';

/**
 * Procedural Web Audio API synthesizer for gentle cosmic ambience
 * and clearly labeled educational sound effects (never presented as real NASA recordings).
 */
class SpaceAudioEngine {
  private ctx: AudioContext | null = null;
  private ambienceGain: GainNode | null = null;
  private ambienceOsc1: OscillatorNode | null = null;
  private ambienceOsc2: OscillatorNode | null = null;
  private ambienceFilter: BiquadFilterNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private ambienceRunning = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public startAmbience(volume: number) {
    const ctx = this.ensureContext();
    if (!ctx || this.ambienceRunning) return;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(
      Math.max(0.001, Math.min(0.35, volume * 0.25)),
      ctx.currentTime + 1.2
    );

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(240, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, ctx.currentTime); // Deep A1 drone

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(82.41, ctx.currentTime); // Gentle E2 fifth harmonic

    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.28;

    // Slow cosmic filter breathing LFO
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 85;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.connect(filter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    lfo.start();

    this.ambienceGain = masterGain;
    this.ambienceOsc1 = osc1;
    this.ambienceOsc2 = osc2;
    this.ambienceFilter = filter;
    this.lfoOsc = lfo;
    this.ambienceRunning = true;
  }

  public setAmbienceVolume(volume: number) {
    if (!this.ctx || !this.ambienceGain || !this.ambienceRunning) return;
    const target = Math.max(0.0001, Math.min(0.35, volume * 0.25));
    this.ambienceGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
  }

  public stopAmbience() {
    if (!this.ambienceRunning || !this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      if (this.ambienceGain) {
        this.ambienceGain.gain.setTargetAtTime(0.0001, now, 0.15);
      }
      const o1 = this.ambienceOsc1;
      const o2 = this.ambienceOsc2;
      const lfo = this.lfoOsc;
      window.setTimeout(() => {
        try {
          o1?.stop();
          o2?.stop();
          lfo?.stop();
          o1?.disconnect();
          o2?.disconnect();
          lfo?.disconnect();
          this.ambienceFilter?.disconnect();
          this.ambienceGain?.disconnect();
        } catch {
          // ignore cleanup errors
        }
      }, 300);
    } finally {
      this.ambienceOsc1 = null;
      this.ambienceOsc2 = null;
      this.lfoOsc = null;
      this.ambienceFilter = null;
      this.ambienceGain = null;
      this.ambienceRunning = false;
    }
  }

  public playSoundEffect(id: SoundEffectId, volume = 0.6) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = Math.max(0.05, Math.min(0.9, volume));
    master.connect(ctx.destination);

    if (id === 'rocket-launch') {
      // Filtered brown/white noise roar + sub-bass rumble
      const duration = 4.2;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.05 * white) / 1.05;
        lastOut = data[i];
        data[i] *= 2.8;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, now);
      filter.frequency.exponentialRampToValueAtTime(520, now + 1.8);
      filter.frequency.exponentialRampToValueAtTime(160, now + duration);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.01, now);
      env.gain.exponentialRampToValueAtTime(0.55, now + 0.8);
      env.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(env);
      env.connect(master);
      noise.start(now);
      noise.stop(now + duration);
      return;
    }

    if (id === 'radio-telemetry') {
      // Carrier tone + discrete telemetry pips
      const notes = [1240, 1480, 1240, 1760, 1480, 1980];
      notes.forEach((freq, idx) => {
        const start = now + idx * 0.28;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        g.gain.setValueAtTime(0.001, start);
        g.gain.linearRampToValueAtTime(0.18, start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
        osc.connect(g);
        g.connect(master);
        osc.start(start);
        osc.stop(start + 0.2);
      });
      return;
    }

    if (id === 'rover-servo') {
      // Rhythmic stepper motor servo sweep
      for (let i = 0; i < 6; i++) {
        const start = now + i * 0.45;
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140 + (i % 2) * 35, start);
        osc.frequency.linearRampToValueAtTime(210, start + 0.25);
        filter.type = 'bandpass';
        filter.frequency.value = 480;
        filter.Q.value = 3;
        g.gain.setValueAtTime(0.001, start);
        g.gain.linearRampToValueAtTime(0.22, start + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, start + 0.36);
        osc.connect(filter);
        filter.connect(g);
        g.connect(master);
        osc.start(start);
        osc.stop(start + 0.38);
      }
      return;
    }

    if (id === 'seismometer') {
      // Deep Marsquake seismic thrum + harmonic tremor
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(88, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 3.4);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.5, now + 0.12);
      g.gain.exponentialRampToValueAtTime(0.001, now + 3.6);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 3.7);
      return;
    }

    if (id === 'plasma-wave') {
      // Interstellar plasma sweep
      const freqs = [320, 480, 640];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f * 1.45, now + 2.0);
        osc.frequency.exponentialRampToValueAtTime(f * 0.9, now + 3.8);
        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.12 / (idx + 1), now + 0.6);
        g.gain.exponentialRampToValueAtTime(0.001, now + 3.9);
        osc.connect(g);
        g.connect(master);
        osc.start(now);
        osc.stop(now + 4.0);
      });
    }
  }
}

export const spaceAudioEngine = new SpaceAudioEngine();
