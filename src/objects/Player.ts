import Phaser from 'phaser';
import {
  PLAYER_DASH_SPEED, PLAYER_DASH_DURATION,
  CEMENT_AMMO_PER_LEVEL, BRICK_AMMO_PER_LEVEL, BRICK_UNLOCK_LEVEL, PROJECTILE_SPEED,
} from '../config';
import { SoundManager } from '../systems/SoundManager';
import { buildCharacterSprite } from '../utils/buildCharacterSprite';
import { Projectile } from './Projectile';
import { CharacterConfig, CHARACTERS } from '../types/CharacterConfig';

type AnimState = 'idle' | 'walk' | 'jump' | 'land';

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
  private charConfig: CharacterConfig;

  private isDashing = false;
  private dashCooldown = 0;
  private facingRight = true;

  private wasOnGround = true;
  private isLanding = false;
  private currentAnim: AnimState = 'idle';
  private hasDoubleJump = false;

  cementAmmo: number = CEMENT_AMMO_PER_LEVEL;
  brickAmmo: number = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    soundManager: SoundManager,
    projectileGroup: Phaser.Physics.Arcade.Group,
    currentLevel: number,
    characterId?: string,
  ) {
    const charConfig = CHARACTERS.find(c => c.id === characterId) ?? CHARACTERS[0];
    buildCharacterSprite(scene, charConfig.textureKey, charConfig.colors);

    super(scene, x, y, charConfig.textureKey, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.soundManager = soundManager;
    this.projectileGroup = projectileGroup;
    this.currentLevel = currentLevel;
    this.charConfig = charConfig;

    this.cementAmmo = CEMENT_AMMO_PER_LEVEL;
    const brickUnlocked = charConfig.brickFromStart || currentLevel >= BRICK_UNLOCK_LEVEL;
    this.brickAmmo = brickUnlocked ? BRICK_AMMO_PER_LEVEL : 0;

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
    this.play(`${this.charConfig.textureKey}_${state}`, true);
  }

  update(delta: number) {
    if (this.isDashing) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down;

    if (!this.wasOnGround && onGround && !this.isLanding) {
      this.triggerLand();
    }
    // Yere değince çift zıplama hakkını sıfırla
    if (onGround) this.hasDoubleJump = false;
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

    if (goLeft)  { this.facingRight = false; this.setFlipX(true); }
    if (goRight) { this.facingRight = true;  this.setFlipX(false); }

    if (throwCement && this.cementAmmo > 0) {
      this.cementAmmo--;
      this.launchProjectile('cement');
    }
    const brickUnlocked = this.charConfig.brickFromStart || this.currentLevel >= BRICK_UNLOCK_LEVEL;
    if (throwBrick && this.brickAmmo > 0 && brickUnlocked) {
      this.brickAmmo--;
      this.launchProjectile('brick');
    }

    this.dashCooldown -= delta;
    if (dash && this.dashCooldown <= 0) {
      this.startDash();
      return;
    }

    if (goLeft) {
      this.setVelocityX(-this.charConfig.speed);
    } else if (goRight) {
      this.setVelocityX(this.charConfig.speed);
    } else {
      this.setVelocityX(0);
    }

    if (jump) {
      if (onGround) {
        this.setVelocityY(this.charConfig.jumpVelocity);
        this.soundManager.jump();
        // Çift zıplama hakkını aç (havaya çıktığında kullanılabilir)
        if (this.charConfig.doubleJump) this.hasDoubleJump = true;
      } else if (this.charConfig.doubleJump && this.hasDoubleJump) {
        this.setVelocityY(this.charConfig.jumpVelocity * 0.85);
        this.soundManager.jump();
        this.hasDoubleJump = false;
      }
    }

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
      this.currentAnim = 'idle';
      this.playAnim('idle');
    });
  }

  private launchProjectile(type: 'cement' | 'brick') {
    const offsetX = this.facingRight ? 28 : -28;
    const proj = new Projectile(this.scene, this.x + offsetX, this.y - 4, type, this.facingRight);
    this.projectileGroup.add(proj);
    const body = proj.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setVelocityX(this.facingRight ? PROJECTILE_SPEED : -PROJECTILE_SPEED);
    body.setVelocityY(0);
  }

  private startDash() {
    this.isDashing = true;
    this.dashCooldown = this.charConfig.dashCooldown;

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
