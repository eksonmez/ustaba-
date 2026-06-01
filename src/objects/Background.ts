import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { LevelTheme } from '../config/levels';

export class Background {
  constructor(scene: Phaser.Scene, theme: LevelTheme, levelWidth: number) {
    this.drawSky(scene, theme);
    this.drawClouds(scene, levelWidth);
    this.drawBuildings(scene, theme, levelWidth);
    this.drawDecorations(scene, levelWidth);
  }

  private drawSky(scene: Phaser.Scene, theme: LevelTheme) {
    // Gökyüzü iki katman gradyan — her zaman ekranı kapsar (scrollFactor 0)
    const sky = scene.add.graphics();
    sky.fillStyle(theme.skyTop);
    sky.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT * 0.55);
    sky.fillStyle(theme.skyBottom);
    sky.fillRect(0, GAME_HEIGHT * 0.4, GAME_WIDTH, GAME_HEIGHT * 0.6);
    sky.setDepth(-10).setScrollFactor(0);
  }

  private drawClouds(scene: Phaser.Scene, levelWidth: number) {
    // Bulutlar level genişliğine yayılır, yavaş paralaks
    const positions = [
      0.05, 0.15, 0.28, 0.40, 0.52, 0.64, 0.76, 0.88,
    ];
    const ys = [50, 80, 35, 70, 55, 40, 75, 60];

    positions.forEach((t, i) => {
      const x = t * levelWidth;
      const y = ys[i % ys.length];
      const g = scene.add.graphics();
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(x,      y,      16);
      g.fillCircle(x + 20, y - 8,  20);
      g.fillCircle(x + 44, y,      16);
      g.fillRect(x - 2, y, 48, 14);
      g.setDepth(-9).setScrollFactor(0.12, 0);
    });
  }

  private drawBuildings(scene: Phaser.Scene, theme: LevelTheme, levelWidth: number) {
    // Bina silüetleri level genişliğine yayılır, orta paralaks
    const pattern = [
      { dx: 0,   w: 70,  h: 160 },
      { dx: 80,  w: 55,  h: 120 },
      { dx: 145, w: 80,  h: 200 },
      { dx: 240, w: 60,  h: 140 },
      { dx: 310, w: 90,  h: 180 },
      { dx: 415, w: 55,  h: 130 },
    ];
    const repeatW = 480;
    const repeats = Math.ceil(levelWidth / repeatW) + 1;
    const groundY = GAME_HEIGHT * 0.75;

    for (let r = 0; r < repeats; r++) {
      const ox = r * repeatW;
      for (const b of pattern) {
        const bx = ox + b.dx;
        const by = groundY - b.h;

        const g = scene.add.graphics();
        // Bina gövdesi
        g.fillStyle(theme.bgTint);
        g.fillRect(bx, by, b.w, b.h);

        // Pencere ışıkları
        const rng = new Phaser.Math.RandomDataGenerator([`b${r}_${b.dx}`]);
        g.fillStyle(0xffd700, 0.5);
        const cols = Math.max(1, Math.floor(b.w / 18));
        const rows = Math.max(1, Math.floor(b.h / 24));
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            if (rng.frac() > 0.45) {
              g.fillRect(bx + 5 + col * 18, by + 6 + row * 24, 9, 12);
            }
          }
        }

        g.setDepth(-8).setScrollFactor(0.3, 0);
      }
    }
  }

  private drawDecorations(scene: Phaser.Scene, levelWidth: number) {
    // Vinç ve iskele dekorasyonları — birkaç noktada
    const spots = [0.25, 0.5, 0.75].map(t => Math.floor(t * levelWidth));
    for (const baseX of spots) {
      this.drawCrane(scene, baseX);
    }
    this.drawScaffolding(scene, Math.floor(levelWidth * 0.08));
    this.drawScaffolding(scene, Math.floor(levelWidth * 0.58));
  }

  private drawCrane(scene: Phaser.Scene, bx: number) {
    const g = scene.add.graphics();
    g.fillStyle(0xe8b84b);
    const groundY = GAME_HEIGHT - 30;

    g.fillRect(bx, groundY - 200, 12, 200);
    g.fillRect(bx - 55, groundY - 200, 130, 8);
    g.fillRect(bx - 55, groundY - 195, 10, 28);
    g.fillRect(bx + 70, groundY - 195, 4, 55);
    g.fillStyle(0xcccccc);
    g.fillRect(bx + 64, groundY - 140, 14, 7);

    g.lineStyle(2, 0xd4a030);
    for (let i = 0; i < 4; i++) {
      g.lineBetween(bx, groundY - i * 50, bx + 12, groundY - (i + 1) * 50);
      g.lineBetween(bx + 12, groundY - i * 50, bx, groundY - (i + 1) * 50);
    }
    g.setDepth(-7).setScrollFactor(0.5, 0);
  }

  private drawScaffolding(scene: Phaser.Scene, sx: number) {
    const g = scene.add.graphics();
    g.lineStyle(3, 0x8b7355, 0.65);
    g.fillStyle(0x8b7355, 0.65);

    const groundY = GAME_HEIGHT - 30;
    const rows = 4;
    const rowH = 48;

    for (let i = 0; i <= rows; i++) {
      g.fillRect(sx, groundY - i * rowH - 4, 80, 5);
    }
    g.fillRect(sx + 2,  groundY - rows * rowH, 5, rows * rowH);
    g.fillRect(sx + 73, groundY - rows * rowH, 5, rows * rowH);
    g.setDepth(-7).setScrollFactor(0.5, 0);
  }
}
