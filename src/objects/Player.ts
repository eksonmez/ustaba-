import Phaser from 'phaser';
import {
  PLAYER_SPEED, PLAYER_JUMP_VELOCITY,
  PLAYER_DASH_SPEED, PLAYER_DASH_DURATION, PLAYER_DASH_COOLDOWN,
  CEMENT_AMMO_PER_LEVEL, BRICK_AMMO_PER_LEVEL, BRICK_UNLOCK_LEVEL, PROJECTILE_SPEED,
} from '../config';
import { SoundManager } from '../systems/SoundManager';
import { buildWorkerSprite } from '../utils/buildWorkerSprite';
import { Projectile } from './Projectile';

type AnimState = 'idle' | 'walk' | 'jump' | 'land' | 'dash';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: {
    up: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private shiftKey: Phaser.Input.Keyboard.Key;
  private eKey: Phaser.Input.Keyboard.Key;
  private qKey: Phaser.Input.Keyboard.Key;
  private soundManager: SoundManager;
  private projectileGroup: Phaser.Physics.Arcade.Group;
  private currentLevel: number;

  private isDashing = false;
  private dashCooldown = 0;
  private facingRight = true;

  private wasOnGround = true;
  private isLanding = false;
  private currentAnim: AnimState = 'idle';

  cementAmmo: number = CEMENT_AMMO_PER_LEVEL;
  brickAmmo: number = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    soundManager: SoundManager,
    projectileGroup: Phaser.Physics.Arcade.Group,
    currentLevel: number,
  ) {
    buildWorkerSprite(scene);

    super(scene, x, y, 'worker', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.soundManager = soundManager;
    this.projectileGroup = projectileGroup;
    this.currentLevel = currentLevel;

    this.cementAmmo = CEMENT_AMMO_PER_LEVEL;
    this.brickAmmo = currentLevel >= BRICK_UNLOCK_LEVEL ? BRICK_AMMO_PER_LEVEL : 0;

    this.playAnim('idle');

    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      left: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.shiftKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.eKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.qKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
  }

  private playAnim(state: AnimState) {
    if (this.currentAnim === state) return;
    this.currentAnim = state;
    this.play('worker_' + state, true);
  }

  update(delta: number) {
    if (this.isDashing) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down;

    // İniş tespiti — havadayken yere değdi mi?
    if (!this.wasOnGround && onGround && !this.isLanding) {
      this.triggerLand();
    }
    this.wasOnGround = onGround;

    if (this.isLanding) return;

    const goLeft  = this.cursors.left.isDown  || this.wasd.left.isDown;
    const goRight = this.cursors.right.isDown || this.wasd.right.isDown;
    const jump =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.wasd.up) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.space);
    const dash = Phaser.Input.Keyboard.JustDown(this.shiftKey);
    const throwCement = Phaser.Input.Keyboard.JustDown(this.eKey);
    const throwBrick   = Phaser.Input.Keyboard.JustDown(this.qKey);

    // Yön
    if (goLeft)  { this.facingRight = false; this.setFlipX(true); }
    if (goRight) { this.facingRight = true;  this.setFlipX(false); }

    // Fırlatma
    if (throwCement && this.cementAmmo > 0) {
      this.cementAmmo--;
      this.launchProjectile('cement');
    }
    if (throwBrick && this.brickAmmo > 0 && this.currentLevel >= BRICK_UNLOCK_LEVEL) {
      this.brickAmmo--;
      this.launchProjectile('brick');
    }

    // Dash
    this.dashCooldown -= delta;
    if (dash && this.dashCooldown <= 0) {
      this.startDash();
      return;
    }

    // Yatay hareket
    if (goLeft) {
      this.setVelocityX(-PLAYER_SPEED);
    } else if (goRight) {
      this.setVelocityX(PLAYER_SPEED);
    } else {
      this.setVelocityX(0);
    }

    // Zıplama
    if (jump && onGround) {
      this.setVelocityY(PLAYER_JUMP_VELOCITY);
      this.soundManager.jump();
    }

    // Animasyon
    if (!onGround) {
      this.playAnim('jump');
    } else if (goLeft || goRight) {
      this.playAnim('walk');
    } else {
      this.playAnim('idle');
    }
  }

  private triggerLand() {
    this.isLanding = true;
    this.setVelocityX(0);
    this.playAnim('land');

    this.scene.time.delayedCall(180, () => {
      this.isLanding = false;
      this.currentAnim = 'idle'; // zorla sıfırla ki playAnim çalışsın
      this.playAnim('idle');
    });
  }

  private launchProjectile(type: 'cement' | 'brick') {
    const offsetX = this.facingRight ? 28 : -28;
    const proj = new Projectile(this.scene, this.x + offsetX, this.y - 4, type, this.facingRight);
    this.projectileGroup.add(proj);
    // Grubu ekledikten sonra hız ve yerçekimi garantile — group.add bazen body'yi sıfırlıyor
    const body = proj.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setVelocityX(this.facingRight ? PROJECTILE_SPEED : -PROJECTILE_SPEED);
    body.setVelocityY(0);
  }

  private startDash() {
    this.isDashing = true;
    this.dashCooldown = PLAYER_DASH_COOLDOWN;

    const dir = this.facingRight ? 1 : -1;
    this.setVelocityX(PLAYER_DASH_SPEED * dir);
    this.setVelocityY(0);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    this.setAlpha(0.6);
    this.setTint(0x00cfff);

    this.scene.time.delayedCall(PLAYER_DASH_DURATION, () => {
      this.isDashing = false;
      this.setAlpha(1);
      this.clearTint();
      (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
      this.setVelocityX(0);
    });
  }
}
