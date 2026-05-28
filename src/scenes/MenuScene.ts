import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { LEVELS } from '../config/levels';

// GEÇİCİ: Test için bölüm seçimi — yayın öncesi kaldırılacak
const DEV_LEVEL_SELECT = true;

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 130, 'USTABAŞI', {
      fontSize: '48px', color: '#f4a261', fontStyle: 'bold',
    }).setOrigin(0.5);

    const startText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, 'BAŞTAN OYNA', {
      fontSize: '22px', color: '#ffffff',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({ targets: startText, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });
    startText.on('pointerdown', () => this.scene.start('GameScene', { level: 0, lives: 3 }));

    if (DEV_LEVEL_SELECT) {
      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, '— TEST: Bölüm Seç —', {
        fontSize: '13px', color: '#ffaa00',
      }).setOrigin(0.5);

      const cols = 3;
      const btnW = 80;
      const btnH = 32;
      const pad  = 14;
      const totalW = cols * btnW + (cols - 1) * pad;
      const startX = GAME_WIDTH / 2 - totalW / 2;
      const startY = GAME_HEIGHT / 2 + 36;

      LEVELS.forEach((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (btnW + pad);
        const y = startY + row * (btnH + 10);

        const bg = this.add.rectangle(x + btnW / 2, y + btnH / 2, btnW, btnH, 0x333333)
          .setInteractive({ useHandCursor: true });

        this.add.text(x + btnW / 2, y + btnH / 2, `Bölüm ${i + 1}`, {
          fontSize: '13px', color: '#ffffff',
        }).setOrigin(0.5);

        bg.on('pointerover',  () => bg.setFillStyle(0x555555));
        bg.on('pointerout',   () => bg.setFillStyle(0x333333));
        bg.on('pointerdown',  () => this.scene.start('GameScene', { level: i, lives: 3 }));
      });
    }
  }
}
