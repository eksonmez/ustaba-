import Phaser from 'phaser';

export class EffectsManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  // Tuğla toplama efekti
  collect(x: number, y: number) {
    this.burst(x, y, 0xffd700, 0xf4a261, 7);
    this.floatText(x, y, '+10', '#ffd700');
  }

  // Düşman ezme efekti
  stomp(x: number, y: number) {
    this.burst(x, y, 0xff4444, 0xff9900, 10);
    this.floatText(x, y, '★ +20', '#ff6644');
    this.scene.cameras.main.shake(150, 0.006);
  }

  // Hasar alma efekti
  damage() {
    // Ekran kırmızı flash
    const flash = this.scene.add.rectangle(
      this.scene.cameras.main.scrollX + this.scene.cameras.main.width / 2,
      this.scene.cameras.main.scrollY + this.scene.cameras.main.height / 2,
      this.scene.cameras.main.width,
      this.scene.cameras.main.height,
      0xff0000, 0.35
    ).setDepth(50);

    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 300,
      onComplete: () => flash.destroy(),
    });

    this.scene.cameras.main.shake(200, 0.008);
  }

  // Parçacık patlaması
  private burst(x: number, y: number, color1: number, color2: number, count: number) {
    for (let i = 0; i < count; i++) {
      const angle  = (i / count) * Math.PI * 2 + Phaser.Math.FloatBetween(-0.3, 0.3);
      const speed  = Phaser.Math.FloatBetween(60, 130);
      const size   = Phaser.Math.Between(3, 7);
      const color  = i % 2 === 0 ? color1 : color2;

      const gfx = this.scene.add.graphics();
      gfx.fillStyle(color);
      gfx.fillRect(-size / 2, -size / 2, size, size);
      gfx.setPosition(x, y).setDepth(15);

      this.scene.tweens.add({
        targets: gfx,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed - 30,
        alpha: 0,
        angle: Phaser.Math.Between(-180, 180),
        duration: Phaser.Math.Between(300, 500),
        ease: 'Quad.easeOut',
        onComplete: () => gfx.destroy(),
      });
    }
  }

  // Yukarı uçan yazı
  private floatText(x: number, y: number, text: string, color: string) {
    const t = this.scene.add.text(x, y - 10, text, {
      fontSize: '16px',
      color,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(16);

    this.scene.tweens.add({
      targets: t,
      y: y - 55,
      alpha: 0,
      duration: 700,
      ease: 'Quad.easeOut',
      onComplete: () => t.destroy(),
    });
  }
}
