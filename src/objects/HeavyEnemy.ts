import Phaser from 'phaser';
import { buildHeavySprite } from '../utils/buildHeavySprite';
import { BaseEnemy } from './BaseEnemy';
import { FREEZE_DURATION } from '../config';

const PATROL_SPEED  = 40;
const CHASE_SPEED   = 70;
const AGGRO_RANGE   = 160;
const DEAGGRO_RANGE = 260;

type EnemyState = 'patrol' | 'chase';

export class HeavyEnemy extends BaseEnemy {
  private moveLeft = true;
  private leftBound: number;
  private rightBound: number;
  private aiState: EnemyState = 'patrol';
  private hp = 2;

  constructor(scene: Phaser.Scene, x: number, y: number, patrolRange: number = 80) {
    buildHeavySprite(scene);

    super(scene, x, y, 'heavy_anim', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.leftBound  = x - patrolRange;
    this.rightBound = x + patrolRange;

    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
    this.setVelocityX(-PATROL_SPEED);
    this.play('heavy_walk');
  }

  protected onUnfreeze() {
    super.onUnfreeze();
    if (this.aiState === 'chase') this.setTint(0xff6666);
    if (this.hp < 2) this.setTint(0xff8800); // hasar rengi
  }

  hitByCement() {
    this.hp--;
    if (this.hp <= 0) {
      this.destroy();
    } else {
      // 1. vuruş: dondur + turuncu parlaklık
      this.freeze(FREEZE_DURATION);
      this.setTint(0xff8800);
      this.scene.time.delayedCall(400, () => {
        if (this.active && this.isFrozen) this.setTint(0x88ccff);
      });
    }
  }

  hitByBrick() {
    this.hp = 0;
    this.destroy();
  }

  update(playerX?: number, playerY?: number) {
    if (this.isFrozen) return;
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (playerX !== undefined && playerY !== undefined) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);
      if (this.aiState === 'patrol' && dist < AGGRO_RANGE) {
        this.aiState = 'chase';
        this.setTint(0xff6666);
      } else if (this.aiState === 'chase' && dist > DEAGGRO_RANGE) {
        this.aiState = 'patrol';
        if (this.hp < 2) this.setTint(0xff8800);
        else this.clearTint();
      }
    }

    if (this.aiState === 'chase' && playerX !== undefined) {
      const dir = playerX > this.x ? 1 : -1;
      body.setVelocityX(CHASE_SPEED * dir);
      this.setFlipX(dir < 0);
    } else {
      if (this.x <= this.leftBound || body.blocked.left) {
        this.moveLeft = false;
        body.setVelocityX(PATROL_SPEED);
      } else if (this.x >= this.rightBound || body.blocked.right) {
        this.moveLeft = true;
        body.setVelocityX(-PATROL_SPEED);
      }
      this.setFlipX(this.moveLeft);
    }
  }
}
