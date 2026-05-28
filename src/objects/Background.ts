import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export class Background {
  constructor(scene: Phaser.Scene) {
    this.drawSky(scene);
    this.drawBuildings(scene);
    this.drawCrane(scene);
    this.drawScaffolding(scene);
    this.drawGround(scene);
  }

  private drawSky(scene: Phaser.Scene) {
    // Turuncu-mavi inşaat günbatımı gradyanı (Phaser gradyan desteği yok, iki katman kullanıyoruz)
    const sky = scene.add.graphics();
    sky.fillStyle(0x4a7fa5); // koyu mavi
    sky.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT * 0.6);
    sky.fillStyle(0xc8602a); // koyu turuncu ufuk
    sky.fillRect(0, GAME_HEIGHT * 0.4, GAME_WIDTH, GAME_HEIGHT * 0.3);
    sky.setDepth(-10);

    // Birkaç bulut
    this.drawCloud(scene, 80,  60);
    this.drawCloud(scene, 300, 40);
    this.drawCloud(scene, 570, 80);
    this.drawCloud(scene, 720, 50);
  }

  private drawCloud(scene: Phaser.Scene, x: number, y: number) {
    const g = scene.add.graphics();
    g.fillStyle(0xffffff, 0.85);
    g.fillCircle(x,      y,      18);
    g.fillCircle(x + 22, y - 8,  22);
    g.fillCircle(x + 46, y,      18);
    g.fillRect(x - 2, y, 50, 16);
    g.setDepth(-9);
  }

  private drawBuildings(scene: Phaser.Scene) {
    // Arka planda bina silüetleri
    const buildings: Array<{ x: number; w: number; h: number; color: number }> = [
      { x: 0,   w: 80,  h: 180, color: 0x4a4a6a },
      { x: 90,  w: 60,  h: 130, color: 0x3a3a5a },
      { x: 160, w: 90,  h: 200, color: 0x4a4a6a },
      { x: 500, w: 100, h: 160, color: 0x3a3a5a },
      { x: 610, w: 70,  h: 220, color: 0x4a4a6a },
      { x: 690, w: 110, h: 150, color: 0x3a3a5a },
    ];

    for (const b of buildings) {
      const g = scene.add.graphics();
      g.fillStyle(b.color);
      g.fillRect(b.x, GAME_HEIGHT - b.h - 30, b.w, b.h);

      // Bina pencereleri
      g.fillStyle(0xffd700, 0.6);
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < Math.floor(b.w / 20); col++) {
          if (Math.random() > 0.35) {
            g.fillRect(b.x + 6 + col * 20, GAME_HEIGHT - b.h - 20 + row * 30, 10, 14);
          }
        }
      }
      g.setDepth(-8);
    }
  }

  private drawCrane(scene: Phaser.Scene) {
    const g = scene.add.graphics();
    g.fillStyle(0xe8b84b);
    g.lineStyle(4, 0xe8b84b);

    const baseX = 370;
    const baseY = GAME_HEIGHT - 30;

    // Kule gövdesi
    g.fillRect(baseX, baseY - 220, 14, 220);

    // Üst kol (yatay)
    g.fillRect(baseX - 60, baseY - 220, 160, 10);

    // Ağırlık tarafı
    g.fillRect(baseX - 60, baseY - 215, 12, 30);

    // Kanca ipi
    g.fillRect(baseX + 80, baseY - 210, 4, 60);

    // Kanca
    g.fillStyle(0xcccccc);
    g.fillRect(baseX + 74, baseY - 150, 16, 8);

    // Kafes detayları (diyagonal çizgiler)
    g.lineStyle(2, 0xd4a030);
    for (let i = 0; i < 5; i++) {
      g.lineBetween(baseX, baseY - i * 44, baseX + 14, baseY - (i + 1) * 44);
      g.lineBetween(baseX + 14, baseY - i * 44, baseX, baseY - (i + 1) * 44);
    }

    g.setDepth(-7);
  }

  private drawScaffolding(scene: Phaser.Scene) {
    const g = scene.add.graphics();
    g.lineStyle(3, 0x8b7355, 0.7);
    g.fillStyle(0x8b7355, 0.7);

    // İskele direkleri — sağ tarafta
    const startX = 650;
    const startY = GAME_HEIGHT - 30;
    const levels = 3;
    const levelH = 50;

    for (let i = 0; i <= levels; i++) {
      // Yatay tahta
      g.fillRect(startX, startY - i * levelH - 4, 90, 6);
    }
    // Dikey direkler
    g.fillRect(startX + 2,  startY - levels * levelH, 6, levels * levelH);
    g.fillRect(startX + 82, startY - levels * levelH, 6, levels * levelH);

    g.setDepth(-7);
  }

  private drawGround(scene: Phaser.Scene) {
    // Zemin şeridi — toprak dokusu
    const g = scene.add.graphics();
    g.fillStyle(0x5c4033);
    g.fillRect(0, GAME_HEIGHT - 32, GAME_WIDTH, 32);
    g.fillStyle(0x4a3020);
    g.fillRect(0, GAME_HEIGHT - 32, GAME_WIDTH, 6);
    g.setDepth(-6);
  }
}
