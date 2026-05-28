// Web Audio API ile ses dosyasına gerek kalmadan basit sesler üretir.
// Gerçek asset'ler hazır olunca bu sistem Phaser'ın ses yöneticisiyle değiştirilecek.

export class SoundManager {
  private ctx: AudioContext;

  constructor() {
    this.ctx = new AudioContext();
  }

  private play(frequency: number, duration: number, type: OscillatorType = 'square', volume = 0.15) {
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }

  jump() {
    this.play(220, 0.08, 'square');
    setTimeout(() => this.play(330, 0.1, 'square'), 60);
  }

  collect() {
    this.play(880, 0.06, 'sine', 0.2);
    setTimeout(() => this.play(1100, 0.1, 'sine', 0.2), 60);
  }

  damage() {
    this.play(150, 0.15, 'sawtooth', 0.25);
    setTimeout(() => this.play(100, 0.2, 'sawtooth', 0.2), 100);
  }

  stomp() {
    this.play(400, 0.05, 'square', 0.2);
    setTimeout(() => this.play(200, 0.1, 'square', 0.15), 50);
  }

  win() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => setTimeout(() => this.play(freq, 0.2, 'sine', 0.2), i * 120));
  }

  gameOver() {
    const notes = [400, 300, 200, 150];
    notes.forEach((freq, i) => setTimeout(() => this.play(freq, 0.25, 'sawtooth', 0.2), i * 150));
  }
}
