import Phaser from 'phaser';
import { FREEZE_DURATION } from '../config';

export abstract class BaseEnemy extends Phaser.Physics.Arcade.Sprite {
  isFrozen = false;
  protected frozenTimer: Phaser.Time.TimerEvent | null = null;

  freeze(duration: number = FREEZE_DURATION) {
    if (!this.active || !this.body) return;
    this.isFrozen = true;
    this.setTint(0x88ccff);
    (this.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    if (this.frozenTimer) this.frozenTimer.remove();
    this.frozenTimer = this.scene.time.delayedCall(duration, () => {
      if (!this.active) return;
      this.isFrozen = false;
      this.onUnfreeze();
    });
  }

  protected onUnfreeze() {
    this.clearTint();
  }

  stomp() {
    this.destroy();
  }

  // Çimento mermisi çarptığında
  hitByCement() {
    this.freeze();
  }

  // Tuğla mermisi çarptığında
  hitByBrick() {
    this.stomp();
  }

  abstract update(playerX?: number, playerY?: number): void;
}
