import Phaser from 'phaser';
import { buildHammerProjectileTexture } from '../utils/buildHammerSprite';

export class EnemyHammer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, facingRight: boolean) {
    buildHammerProjectileTexture(scene);

    super(scene, x, y, 'enemy_hammer_proj');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const vx = facingRight ? 220 : -220;
    this.setVelocityX(vx);
    this.setVelocityY(-60); // hafif yay etkisi
    (this.body as Phaser.Physics.Arcade.Body).setGravityY(300);
    this.setFlipX(!facingRight);
    this.setRotation(facingRight ? 0.3 : -0.3);

    // 3 saniye sonra ekrandan çıkmamışsa imha et
    scene.time.delayedCall(3000, () => {
      if (this.active) this.destroy();
    });
  }
}
