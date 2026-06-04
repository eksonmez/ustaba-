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

  get dashing(): boolean { return this.isDashing; }
  get hasDashStun(): boolean { return this.charConfig.dashStun ?? false; }
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

    // Duvarcı: duvara değince yavaş kayış
    if (this.charConfig.wallSlide && !onGround) {
      if ((body.blocked.left || body.blocked.right) && body.velocity.y > 50) {
        body.setVelocityY(50);
      }
    }

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
      this.launchProjectile(this.charConfig.piercingProjectile ? 'pipe' : 'brick');
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
        if (this.charConfig.doubleJump) this.hasDoubleJump = true;
      } else if (this.charConfig.wallSlide && (body.blocked.left || body.blocked.right)) {
        // Duvarcı: duvardan zıplama — yukarı + duvara ters yön
        const pushDir = body.blocked.left ? 1 : -1;
        this.setVelocityY(this.charConfig.jumpVelocity);
        this.setVelocityX(this.charConfig.speed * pushDir);
        this.facingRight = pushDir > 0;
        this.setFlipX(!this.facingRight);
        this.soundManager.jump();
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

  private launchProjectile(type: 'cement' | 'brick' | 'pipe') {
    const offsetX = this.facingRight ? 28 : -28;
    const piercing = type === 'pipe';
    const proj = new Projectile(this.scene, this.x + offsetX, this.y - 4, type, this.facingRight, piercing);
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

    if (this.charConfig.dashStun) {
      this.setAlpha(0.9);
      this.setTint(0xf5e642);
      this.electricDashEffect();
    } else {
      this.setAlpha(0.6);
      this.setTint(0x00cfff);
    }

    this.scene.time.delayedCall(PLAYER_DASH_DURATION, () => {
      this.isDashing = false;
      this.setAlpha(1);
      this.clearTint();
      (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
      this.setVelocityX(0);
    });
  }

  private electricDashEffect() {
    // Başlangıç patlaması
    this.spawnSparkBurst(12);

    // Sarı ↔ beyaz tint titremesi
    let yellow = true;
    this.scene.time.addEvent({
      delay: 30,
      repeat: Math.floor(PLAYER_DASH_DURATION / 30) - 1,
      callback: () => {
        if (!this.isDashing) return;
        yellow = !yellow;
        this.setTint(yellow ? 0xf5e642 : 0xffffff);
      },
    });

    // Hayalet iz (afterimage)
    this.scene.time.addEvent({
      delay: 20,
      repeat: Math.floor(PLAYER_DASH_DURATION / 20) - 1,
      callback: () => {
        if (!this.active) return;
        const ghost = this.scene.add.sprite(this.x, this.y, this.texture.key, this.frame.name)
          .setAlpha(0.55).setTint(0xf5e642).setFlipX(this.flipX)
          .setScale(this.scaleX, this.scaleY).setDepth(12);
        this.scene.tweens.add({
          targets: ghost,
          alpha: 0,
          scaleX: ghost.scaleX * 0.7,
          scaleY: ghost.scaleY * 0.7,
          duration: 120,
          onComplete: () => ghost.destroy(),
        });
      },
    });

    // Sürekli kıvılcım
    this.scene.time.addEvent({
      delay: 18,
      repeat: Math.floor(PLAYER_DASH_DURATION / 18) - 1,
      callback: () => {
        if (!this.active) return;
        this.spawnSpark();
      },
    });
  }

  private spawnSparkBurst(count: number) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Phaser.Math.FloatBetween(-0.4, 0.4);
      const speed = Phaser.Math.FloatBetween(50, 140);
      const size  = Phaser.Math.Between(4, 10);
      const color = i % 2 === 0 ? 0xf5e642 : 0xffffff;

      const gfx = this.scene.add.graphics().setDepth(15);
      gfx.fillStyle(color, 1);
      gfx.fillRect(-size / 2, -size / 2, size, size);
      gfx.setPosition(this.x, this.y);

      this.scene.tweens.add({
        targets: gfx,
        x: this.x + Math.cos(angle) * speed,
        y: this.y + Math.sin(angle) * speed - 20,
        alpha: 0,
        angle: Phaser.Math.Between(-180, 180),
        duration: Phaser.Math.Between(200, 380),
        ease: 'Quad.easeOut',
        onComplete: () => gfx.destroy(),
      });
    }
  }

  private spawnSpark() {
    const ox = Phaser.Math.Between(-10, 10);
    const oy = Phaser.Math.Between(-18, 8);
    const color = Math.random() > 0.4 ? 0xf5e642 : 0xffffff;
    const size  = Phaser.Math.Between(3, 8);

    const gfx = this.scene.add.graphics().setDepth(14);
    gfx.fillStyle(color, 1);
    gfx.fillTriangle(-size / 2, 0, size / 2, 0, 0, -size * 1.6);
    gfx.setPosition(this.x + ox, this.y + oy);

    this.scene.tweens.add({
      targets: gfx,
      alpha: 0,
      y: gfx.y - Phaser.Math.Between(20, 45),
      scaleX: 0.1,
      scaleY: 0.1,
      duration: Phaser.Math.Between(100, 200),
      ease: 'Quad.easeOut',
      onComplete: () => gfx.destroy(),
    });
  }
}
