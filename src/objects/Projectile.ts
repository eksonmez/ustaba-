import Phaser from 'phaser';
import { PROJECTILE_SPEED } from '../config';

export type ProjectileType = 'cement' | 'brick';

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  readonly projectileType: ProjectileType;

  constructor(scene: Phaser.Scene, x: number, y: number, type: ProjectileType, facingRight: boolean) {
    const key = type === 'cement' ? 'proj_cement' : 'proj_brick';
    Projectile.ensureTexture(scene, key, type);

    super(scene, x, y, key);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.projectileType = type;
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
