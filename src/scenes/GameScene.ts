import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { LEVELS } from '../config/levels';
import { Player } from '../objects/Player';
import { Enemy } from '../objects/Enemy';
import { Collectible } from '../objects/Collectible';
import { ScoreManager } from '../systems/ScoreManager';
import { SoundManager } from '../systems/SoundManager';
import { Background } from '../objects/Background';
import { MovingPlatform } from '../objects/MovingPlatform';
import { EffectsManager } from '../systems/EffectsManager';

const MAX_LIVES = 3;

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private movingPlatforms!: MovingPlatform[];
  private collectibles!: Phaser.GameObjects.Group;
  private enemies!: Phaser.GameObjects.Group;
  private scoreManager!: ScoreManager;
  private soundManager!: SoundManager;
  private effects!: EffectsManager;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private lives = MAX_LIVES;
  private currentLevel = 0;
  private isInvincible = false;
  private gameFinished = false;
  private isWaiting = true;

  constructor() {
    super({ key: 'GameScene' });
  }

  // Bölüm numarası dışarıdan verilebilir (init ile)
  init(data: { level?: number; lives?: number; score?: number }) {
    this.currentLevel = data.level ?? 0;
    this.lives        = data.lives ?? MAX_LIVES;
  }

  create() {
    this.gameFinished = false;
    this.isInvincible = false;
    this.isWaiting    = true;

    this.scoreManager = new ScoreManager();
    this.soundManager = new SoundManager();
    this.effects      = new EffectsManager(this);

    const levelCfg = LEVELS[this.currentLevel];

    new Background(this);

    this.platforms = this.physics.add.staticGroup();
    for (const p of levelCfg.platforms) {
      this.addPlatform(p.x, p.y, p.w, p.h, p.color);
    }

    this.movingPlatforms = [];
    for (const mp of levelCfg.movingPlatforms ?? []) {
      this.movingPlatforms.push(
        new MovingPlatform(this, mp.x, mp.y, mp.w, mp.h, mp.color, mp.moveType, mp.range, mp.speed)
      );
    }

    this.collectibles = this.add.group();
    for (const c of levelCfg.collectibles) {
      this.collectibles.add(new Collectible(this, c.x, c.y));
    }

    this.enemies = this.add.group();
    for (const e of levelCfg.enemies) {
      this.enemies.add(new Enemy(this, e.x, e.y, e.range));
    }

    this.physics.add.collider(this.enemies.getChildren(), this.platforms);
    this.physics.add.collider(this.enemies.getChildren(), this.movingPlatforms);

    this.player = new Player(this, levelCfg.playerStart.x, levelCfg.playerStart.y, this.soundManager);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movingPlatforms);

    this.physics.add.overlap(this.player, this.collectibles, (_p, col) => {
      const picked = (col as Collectible).collect();
      if (!picked) return;
      this.soundManager.collect();
      this.effects.collect((col as Collectible).x, (col as Collectible).y);
      this.scoreManager.add(10);
      this.scoreText.setText('SKOR: ' + this.scoreManager.getScore());
      if (this.collectibles.countActive() === 0) {
        this.levelComplete();
      }
    });

    this.physics.add.overlap(this.player, this.enemies, (_p, enemy) => {
      if (this.gameFinished || this.isInvincible) return;
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      const e = enemy as Enemy;
      if (body.velocity.y > 0 && this.player.y < e.y) {
        this.effects.stomp(e.x, e.y);
        e.stomp();
        this.soundManager.stomp();
        this.player.setVelocityY(-300);
        this.scoreManager.add(20);
        this.scoreText.setText('SKOR: ' + this.scoreManager.getScore());
      } else {
        this.takeDamage();
      }
    });

    this.cameras.main.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.cameras.main.startFollow(this.player);

    // HUD
    this.scoreText = this.add.text(10, 10, 'SKOR: 0', {
      fontSize: '18px', color: '#ffd700', fontStyle: 'bold',
    }).setScrollFactor(0);

    this.livesText = this.add.text(GAME_WIDTH - 10, 10, 'CAN: ' + this.lives, {
      fontSize: '18px', color: '#ff4444', fontStyle: 'bold',
    }).setOrigin(1, 0).setScrollFactor(0);

    this.add.text(GAME_WIDTH / 2, 10, `BÖLÜM ${this.currentLevel + 1}`, {
      fontSize: '18px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5, 0).setScrollFactor(0);

    this.add.text(10, 34, '← → / A D: hareket   W / ↑ / Space: zıpla   Shift: dash', {
      fontSize: '11px', color: '#aaaaaa',
    }).setScrollFactor(0);

    // Bekleme ekranı — oyuncu hareket ettirince başlar
    this.showReadyScreen();
  }

  private showReadyScreen() {
    // Fizik dünyasını durdur — düşmanlar ve oyuncu donuk kalsın
    this.physics.pause();

    const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 420, 180, 0x000000, 0.65)
      .setScrollFactor(0).setDepth(20);
    overlay;

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, `BÖLÜM ${this.currentLevel + 1}`, {
      fontSize: '40px', color: '#ffd700', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(21);

    const hint = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, 'Başlamak için hareket et', {
      fontSize: '20px', color: '#ffffff',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(21);

    // Yanıp sönme
    this.tweens.add({
      targets: hint,
      alpha: 0.2,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    // Herhangi bir hareket tuşuna basınca başla
    const keys = [
      this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    ];

    const startGame = () => {
      if (!this.isWaiting) return;
      this.isWaiting = false;
      this.physics.resume();
      // Overlay ve yazıları temizle
      this.children.list
        .filter(c => (c as Phaser.GameObjects.GameObject & { depth?: number }).depth !== undefined &&
                     ((c as unknown as { depth: number }).depth) >= 20)
        .forEach(c => c.destroy());
      // Dinleyicileri kaldır
      keys.forEach(k => k.destroy());
    };

    keys.forEach(k => k.on('down', startGame));
  }

  private levelComplete() {
    if (this.gameFinished) return;
    this.gameFinished = true;

    const isLastLevel = this.currentLevel >= LEVELS.length - 1;

    this.soundManager.win();

    const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 420, 200, 0x000000, 0.75)
      .setScrollFactor(0).setDepth(10);
    overlay;

    const msg = isLastLevel ? 'TÜM BÖLÜMLER TAMAMLANDI!' : `BÖLÜM ${this.currentLevel + 1} TAMAMLANDI!`;
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, msg, {
      fontSize: '28px', color: '#ffd700', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(11);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, `Skor: ${this.scoreManager.getScore()}`, {
      fontSize: '20px', color: '#ffffff',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(11);

    if (isLastLevel) {
      const menuBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, '[ ANA MENÜ ]', {
        fontSize: '20px', color: '#f4a261', fontStyle: 'bold',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(11).setInteractive({ useHandCursor: true });
      menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
    } else {
      const nextBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, '[ SONRAKİ BÖLÜM ]', {
        fontSize: '20px', color: '#f4a261', fontStyle: 'bold',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(11).setInteractive({ useHandCursor: true });

      const menuBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 76, '[ ANA MENÜ ]', {
        fontSize: '15px', color: '#aaaaaa',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(11).setInteractive({ useHandCursor: true });

      nextBtn.on('pointerdown', () => {
        this.scene.start('GameScene', {
          level: this.currentLevel + 1,
          lives: this.lives,
        });
      });
      menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
    }
  }

  private takeDamage() {
    if (this.isInvincible || this.gameFinished) return;

    this.lives -= 1;
    this.soundManager.damage();
    this.livesText.setText('CAN: ' + this.lives);

    if (this.lives <= 0) {
      this.effects.damage();
      this.showGameOver();
      return;
    }
    this.effects.damage();

    this.isInvincible = true;
    this.tweens.add({ targets: this.player, alpha: 0.2, duration: 150, yoyo: true, repeat: 4 });
    this.time.delayedCall(1500, () => {
      if (!this.gameFinished) { this.player.setAlpha(1); this.isInvincible = false; }
    });
  }

  private showGameOver() {
    if (this.gameFinished) return;
    this.gameFinished = true;

    this.player.setVelocity(0, 0);
    this.player.setActive(false);
    this.soundManager.gameOver();

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 400, 200, 0x000000, 0.75)
      .setScrollFactor(0).setDepth(10);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, 'OYUN BİTTİ', {
      fontSize: '36px', color: '#e63946', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(11);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 16, `Skor: ${this.scoreManager.getScore()}`, {
      fontSize: '20px', color: '#ffffff',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(11);

    const restartBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 26, '[ BAŞTAN BAŞLA ]', {
      fontSize: '20px', color: '#f4a261', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(11).setInteractive({ useHandCursor: true });

    const menuBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 62, '[ ANA MENÜ ]', {
      fontSize: '15px', color: '#aaaaaa',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(11).setInteractive({ useHandCursor: true });

    // Baştan başla = bölüm 1, can 3
    restartBtn.on('pointerdown', () => this.scene.start('GameScene', { level: 0, lives: MAX_LIVES }));
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
  }

  private addPlatform(x: number, y: number, w: number, h: number, color: number) {
    const key = `plat_${w}_${h}_${color}`;
    if (!this.textures.exists(key)) {
      const gfx = this.add.graphics();
      gfx.fillStyle(color);
      gfx.fillRect(0, 0, w, h);
      gfx.generateTexture(key, w, h);
      gfx.destroy();
    }
    const p = this.platforms.create(x + w / 2, y + h / 2, key) as Phaser.Physics.Arcade.Image;
    p.refreshBody();
  }

  update(_time: number, delta: number) {
    if (this.gameFinished || this.isWaiting) return;
    this.player.update(delta);
    for (const e of this.enemies.getChildren()) {
      (e as Enemy).update(this.player.x, this.player.y);
    }
    for (const mp of this.movingPlatforms) mp.update();
  }
}
