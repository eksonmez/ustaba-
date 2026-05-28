import Phaser from 'phaser';
import { buildEnemySprite } from '../utils/buildEnemySprite';

const PATROL_SPEED = 80;
const CHASE_SPEED  = 140;
const AGGRO_RANGE  = 180;
const DEAGGRO_RANGE = 280;

type EnemyState = 'patrol' | 'chase';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private moveLeft = true;
  private leftBound: number;
  private rightBound: number;
  private aiState: EnemyState = 'patrol';

  constructor(scene: Phaser.Scene, x: number, y: number, patrolRange: number = 80) {
    buildEnemySprite(scene);

    super(scene, x, y, 'enemy_anim', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.leftBound  = x - patrolRange;
    this.rightBound = x + patrolRange;

    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
    this.setVelocityX(-PATROL_SPEED);
    this.play('enemy_walk');
  }

  update(playerX?: number, playerY?: number) {
    const body = this.body as Phaser.Physics.Arcade.Body;

    // Aggro tespiti
    if (playerX !== undefined && playerY !== undefined) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);
      if (this.aiState === 'patrol' && dist < AGGRO_RANGE) {
        this.aiState = 'chase';
        this.setTint(0xff6666); // kırmızı parlaklık — saldırı modu
      } else if (this.aiState === 'chase' && dist > DEAGGRO_RANGE) {
        this.aiState = 'patrol';
        this.clearTint();
      }
    }

    if (this.aiState === 'chase' && playerX !== undefined) {
      // Oyuncuya doğru koş
      const dir = playerX > this.x ? 1 : -1;
      body.setVelocityX(CHASE_SPEED * dir);
      this.setFlipX(dir < 0);
    } else {
      // Devriye
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

  stomp() {
    this.destroy();
  }
}
