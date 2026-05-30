import Phaser from 'phaser';
import { buildHammerSprite } from '../utils/buildHammerSprite';
import { BaseEnemy } from './BaseEnemy';
import { EnemyHammer } from './EnemyHammer';

const PATROL_SPEED   = 55;
const AGGRO_RANGE    = 350; // çekiç menzili
const THROW_COOLDOWN = 2500; // ms

type EnemyState = 'patrol' | 'alert';

export class HammerEnemy extends BaseEnemy {
  private moveLeft = true;
  private leftBound: number;
  private rightBound: number;
  private aiState: EnemyState = 'patrol';
  private throwTimer = 0;
  private hammerGroup: Phaser.Physics.Arcade.Group;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    patrolRange: number = 80,
    hammerGroup: Phaser.Physics.Arcade.Group,
  ) {
    buildHammerSprite(scene);

    super(scene, x, y, 'hammer_anim', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.leftBound  = x - patrolRange;
    this.rightBound = x + patrolRange;
    this.hammerGroup = hammerGroup;

    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
    this.setVelocityX(-PATROL_SPEED);
    this.play('hammer_walk');
  }

  protected onUnfreeze() {
    super.onUnfreeze();
    this.play('hammer_walk');
  }

  update(playerX?: number, playerY?: number) {
    if (this.isFrozen) return;
    const body = this.body as Phaser.Physics.Arcade.Body;
    const delta = this.scene.game.loop.delta;

    // Oyuncu menzildeyse alert moda geç
    if (playerX !== undefined && playerY !== undefined) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);
      this.aiState = dist < AGGRO_RANGE ? 'alert' : 'patrol';
    }

    // Devriye
    if (this.x <= this.leftBound || body.blocked.left) {
      this.moveLeft = false;
      body.setVelocityX(PATROL_SPEED);
    } else if (this.x >= this.rightBound || body.blocked.right) {
      this.moveLeft = true;
      body.setVelocityX(-PATROL_SPEED);
    }
    this.setFlipX(this.moveLeft);

    // Çekiç fırlatma cooldown
    if (this.aiState === 'alert' && playerX !== undefined) {
      this.throwTimer -= delta;
      if (this.throwTimer <= 0) {
        this.throwTimer = THROW_COOLDOWN;
        this.throwHammer(playerX);
      }
    } else {
      // Menzil dışında cooldown'ı sıfırla (ama tamamen değil — hemen fırlatmasın)
      if (this.throwTimer <= 0) this.throwTimer = THROW_COOLDOWN * 0.5;
    }

    // Walk animasyonu
    if (!this.anims.currentAnim?.key.includes('throw')) {
      this.play('hammer_walk', true);
    }
  }

  private throwHammer(playerX: number) {
    // Fırlatma animasyonu
    this.play('hammer_throw');
    this.scene.time.delayedCall(300, () => {
      if (!this.active) return;
      this.play('hammer_walk');
    });

    const facingRight = playerX > this.x;
    this.setFlipX(!facingRight);

    const hammer = new EnemyHammer(this.scene, this.x, this.y - 8, facingRight);
    this.hammerGroup.add(hammer);
    // Body'yi grup ekledikten sonra garantile
    const b = hammer.body as Phaser.Physics.Arcade.Body;
    b.setVelocityX(facingRight ? 220 : -220);
    b.setVelocityY(-60);
  }
}
