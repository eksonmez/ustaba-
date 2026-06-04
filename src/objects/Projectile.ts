import Phaser from 'phaser';
import { PROJECTILE_SPEED } from '../config';

export type ProjectileType = 'cement' | 'brick' | 'pipe';

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  readonly projectileType: ProjectileType;
  readonly piercing: boolean;
  readonly hitEnemyIds: Set<Phaser.GameObjects.GameObject> = new Set();

  constructor(scene: Phaser.Scene, x: number, y: number, type: ProjectileType, facingRight: boolean, piercing = false) {
    const key = type === 'cement' ? 'proj_cement' : type === 'pipe' ? 'proj_pipe' : 'proj_brick';
    Projectile.ensureTexture(scene, key, type);

    super(scene, x, y, key);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.projectileType = type;
    this.piercing = piercing;
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.setVelocityX(facingRight ? PROJECTILE_SPEED : -PROJECTILE_SPEED);
    this.setFlipX(!facingRight);

    // 2 saniye sonra ekrandan çıkmamışsa kendini imha et
    scene.time.delayedCall(2000, () => {
      if (this.active) this.destroy();
    });
  }

  private static ensureTexture(scene: Phaser.Scene, key: string, type: ProjectileType) {
    if (scene.textures.exists(key)) return;
    const gfx = scene.add.graphics();
    if (type === 'cement') {
      // Gri çimento topu
      gfx.fillStyle(0x999999);
      gfx.fillCircle(8, 8, 8);
      gfx.fillStyle(0xbbbbbb);
      gfx.fillCircle(5, 5, 3);
      gfx.generateTexture(key, 16, 16);
    } else if (type === 'pipe') {
      // Çelik boru: gövde + highlight + uç kapaklar
      const W = 28, H = 10;
      // Gövde
      gfx.fillStyle(0x6688aa);
      gfx.fillRect(3, 0, W - 6, H);
      // Üst highlight şeridi
      gfx.fillStyle(0x99bbdd);
      gfx.fillRect(3, 1, W - 6, 3);
      // Alt gölge
      gfx.fillStyle(0x334455);
      gfx.fillRect(3, H - 2, W - 6, 2);
      // Sol kapak
      gfx.fillStyle(0x445566);
      gfx.fillRect(0, 1, 4, H - 2);
      gfx.fillStyle(0x7799bb);
      gfx.fillRect(1, 2, 2, H - 4);
      // Sağ kapak
      gfx.fillStyle(0x445566);
      gfx.fillRect(W - 4, 1, 4, H - 2);
      gfx.fillStyle(0x7799bb);
      gfx.fillRect(W - 3, 2, 2, H - 4);
      gfx.generateTexture(key, W, H);
    } else {
      // Tuğla kırmızısı dikdörtgen
      gfx.fillStyle(0xc1440e);
      gfx.fillRect(0, 0, 22, 13);
      gfx.lineStyle(1, 0x8b2500);
      gfx.strokeRect(0, 0, 22, 13);
      gfx.lineStyle(1, 0x8b2500);
      gfx.lineBetween(11, 0, 11, 13);
      gfx.lineBetween(0, 6, 22, 6);
      gfx.generateTexture(key, 22, 13);
    }
    gfx.destroy();
  }
}
