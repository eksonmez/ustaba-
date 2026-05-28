import Phaser from 'phaser';

const TEXTURE_KEY = 'collectible';
const W = 28;
const H = 18;

function buildTexture(scene: Phaser.Scene) {
  if (scene.textures.exists(TEXTURE_KEY)) return;

  const g = scene.add.graphics();

  // Tuğla ana rengi
  g.fillStyle(0xc0392b);
  g.fillRect(0, 0, W, H);

  // Sağ ve alt kenar gölgesi (derinlik hissi)
  g.fillStyle(0x8b1a10);
  g.fillRect(W - 3, 0,     3, H);  // sağ gölge
  g.fillRect(0,     H - 3, W, 3);  // alt gölge

  // Sol ve üst kenar aydınlık
  g.fillStyle(0xe05040);
  g.fillRect(0, 0, W, 2);   // üst parlaklık
  g.fillRect(0, 0, 2, H);   // sol parlaklık

  // Yatay harç çizgisi (ortada)
  g.fillStyle(0xd4b896);
  g.fillRect(2, H / 2 - 1, W - 4, 2);

  // Dikey harç çizgileri (tuğla derz deseni)
  g.fillRect(W / 2 - 1, 2,         2, H / 2 - 3); // üst yarı ortası
  g.fillRect(W / 4 - 1, H / 2 + 1, 2, H / 2 - 3); // alt yarı sol
  g.fillRect(3 * W / 4,  H / 2 + 1, 2, H / 2 - 3); // alt yarı sağ

  // Tuğla yüzey dokusu (küçük noktalar)
  g.fillStyle(0xb03020, 0.5);
  g.fillRect(5,      4,  2, 2);
  g.fillRect(16,     4,  2, 2);
  g.fillRect(9,      7,  2, 2);
  g.fillRect(20,     7,  2, 2);
  g.fillRect(4,      12, 2, 2);
  g.fillRect(14,     12, 2, 2);

  // Dış kenarlık
  g.lineStyle(1, 0x6b1a10);
  g.strokeRect(0, 0, W, H);

  // Parlama efekti — sol üst köşe
  g.fillStyle(0xffffff, 0.15);
  g.fillRect(2, 2, 8, 3);

  g.generateTexture(TEXTURE_KEY, W, H);
  g.destroy();
}

export class Collectible extends Phaser.Physics.Arcade.Sprite {
  private collected = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    buildTexture(scene);

    super(scene, x, y, TEXTURE_KEY);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // Yukarı-aşağı süzülme
    scene.tweens.add({
      targets: this,
      y: y - 6,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Hafif parıldama
    scene.tweens.add({
      targets: this,
      alpha: 0.75,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: Phaser.Math.Between(0, 600),
    });
  }

  collect(): boolean {
    if (this.collected) return false;
    this.collected = true;
    this.destroy();
    return true;
  }
}
