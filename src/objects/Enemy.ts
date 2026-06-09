import Phaser from 'phaser';
import { buildEnemySprite } from '../utils/buildEnemySprite';
import { BaseEnemy } from './BaseEnemy';

const PATROL_SPEED     = 80;
const CHASE_SPEED      = 100;
const AGGRO_RANGE      = 180;
const DEAGGRO_RANGE    = 280;
const MIN_CHASE_DIST   = 90;
const JUMP_VELOCITY    = -380;
const JUMP_COOLDOWN_MS = 800;
const TRAIL_START_DELAY = 20;  // agro anında kaç adım geride başlasın
const WAYPOINT_REACH    = 28;  // waypoint'e bu kadar yaklaşınca geç

type EnemyState = 'patrol' | 'chase';

export class Enemy extends BaseEnemy {
  private moveLeft = true;
  private leftBound: number;
  private rightBound: number;
  private aiState: EnemyState = 'patrol';
  private lastJumpTime = 0;
  private waypointIndex = 0;
  private trailStarted = false;

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

  protected onUnfreeze() {
    super.onUnfreeze();
    if (this.aiState === 'chase') this.setTint(0xff6666);
  }

  update(playerX?: number, playerY?: number, trail?: {x: number, y: number}[]) {
    if (this.isFrozen) return;
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (playerX !== undefined && playerY !== undefined) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);
      if (this.aiState === 'patrol' && dist < AGGRO_RANGE) {
        this.aiState = 'chase';
        this.setTint(0xff6666);
        // Agro olunca trail'de TRAIL_START_DELAY adım geride başla
        if (trail) {
          this.waypointIndex = Math.max(0, trail.length - TRAIL_START_DELAY);
          this.trailStarted = true;
        }
      } else if (this.aiState === 'chase' && dist > DEAGGRO_RANGE) {
        this.aiState = 'patrol';
        this.clearTint();
        this.trailStarted = false;
      }
    }

    if (this.aiState === 'chase' && playerX !== undefined) {
      const hasTrail = this.trailStarted && trail && trail.length > 0;
      const wp = hasTrail ? trail![Math.min(this.waypointIndex, trail!.length - 1)] : null;

      // Waypoint'e yatayda yaklaştıysa ilerle (Y farkı önemli değil)
      if (wp && this.waypointIndex < trail!.length - 1) {
        if (Math.abs(this.x - wp.x) < WAYPOINT_REACH) this.waypointIndex++;
      }

      const targetX = wp ? wp.x : playerX;
      const targetY = wp ? wp.y : (playerY ?? this.y);
      const dir = targetX > this.x ? 1 : -1;

      // Trail modunda her zaman ilerle; fallback'te min mesafeyi koru
      if (hasTrail) {
        body.setVelocityX(CHASE_SPEED * dir);
      } else {
        const horizDist = Math.abs(targetX - this.x);
        body.setVelocityX(horizDist > MIN_CHASE_DIST ? CHASE_SPEED * dir : 0);
      }
      this.setFlipX(dir < 0);

      const onGround = body.blocked.down;
      const blockedAhead = (dir > 0 && body.blocked.right) || (dir < 0 && body.blocked.left);

      // Hem mevcut waypoint'e hem 6 adım ileriye bak
      let targetAbove = (this.y - targetY) > 60;
      if (!targetAbove && trail && this.waypointIndex < trail.length) {
        const lookAheadWp = trail[Math.min(this.waypointIndex + 6, trail.length - 1)];
        if (lookAheadWp) targetAbove = (this.y - lookAheadWp.y) > 60;
      }

      const now = this.scene.time.now;
      if (onGround && (blockedAhead || targetAbove) && now - this.lastJumpTime > JUMP_COOLDOWN_MS) {
        body.setVelocityY(JUMP_VELOCITY);
        this.lastJumpTime = now;
      }
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
