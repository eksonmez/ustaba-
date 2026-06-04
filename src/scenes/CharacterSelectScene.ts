import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { CHARACTERS, CharacterConfig } from '../types/CharacterConfig';
import { buildCharacterSprite } from '../utils/buildCharacterSprite';

const CARD_W = 160;
const CARD_H = 240;
const CARD_GAP = 20;
const CARDS_START_X = (GAME_WIDTH - (CHARACTERS.length * CARD_W + (CHARACTERS.length - 1) * CARD_GAP)) / 2;
const CARDS_Y = 130;

export class CharacterSelectScene extends Phaser.Scene {
  private selectedIndex = 0;
  private cardBgs: Phaser.GameObjects.Graphics[] = [];
  private startData: { level: number; lives: number } = { level: 0, lives: 3 };

  constructor() {
    super({ key: 'CharacterSelectScene' });
  }

  init(data: { level?: number; lives?: number }) {
    this.startData = { level: data.level ?? 0, lives: data.lives ?? 3 };
    this.selectedIndex = 0;
  }

  create() {
    this.cardBgs = [];

    for (const char of CHARACTERS) {
      buildCharacterSprite(this, char.textureKey, char.colors);
    }

    this.drawBackground();
    this.drawTitle();
    this.drawCards();
    this.drawPlayButton();
    this.drawBackButton();
  }

  private drawBackground() {
    const bg = this.add.graphics();
    const steps = 50;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const rv = Math.round(Phaser.Math.Linear(15, 140, t));
      const gv = Math.round(Phaser.Math.Linear(20, 60, t));
      const bv = Math.round(Phaser.Math.Linear(60, 25, t));
      bg.fillStyle((rv << 16) | (gv << 8) | bv, 1);
      bg.fillRect(0, i * (GAME_HEIGHT / steps), GAME_WIDTH, GAME_HEIGHT / steps + 1);
    }

    // Zemin
    bg.fillStyle(0x2a1a0a, 1);
    bg.fillRect(0, GAME_HEIGHT * 0.88, GAME_WIDTH, GAME_HEIGHT * 0.12);
  }

  private drawTitle() {
    this.add.text(GAME_WIDTH / 2 + 2, 42, 'KARAKTER SEÇ', {
      fontSize: '34px', color: '#7a3a00', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 40, 'KARAKTER SEÇ', {
      fontSize: '34px', color: '#f4a261', fontStyle: 'bold',
      stroke: '#7a3a00', strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 80, 'Hangi usta olmak istersin?', {
      fontSize: '15px', color: '#ffe0b2', fontStyle: 'italic',
    }).setOrigin(0.5);
  }

  private drawCards() {
    CHARACTERS.forEach((char, i) => {
      const cx = CARDS_START_X + i * (CARD_W + CARD_GAP);
      this.drawCard(cx, CARDS_Y, char, i);
    });

    this.highlightCard(this.selectedIndex);
  }

  private drawCard(x: number, y: number, char: CharacterConfig, index: number) {
    // Kart arka planı
    const bg = this.add.graphics();
    bg.fillStyle(0x1a1020, 0.9);
    bg.fillRoundedRect(x, y, CARD_W, CARD_H, 10);
    bg.lineStyle(2, 0x555555, 1);
    bg.strokeRoundedRect(x, y, CARD_W, CARD_H, 10);
    this.cardBgs.push(bg);

    // 2.5x ölçek → 80x100px; merkez y+55 → tepe y+5, sallanma y+5→y+1 arası (kart içinde kalır)
    const sprite = this.add.sprite(x + CARD_W / 2, y + 55, char.textureKey, 0)
      .setScale(2.5);
    this.tweens.add({
      targets: sprite,
      y: y + 51,
      duration: 1200 + index * 200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // İsim
    this.add.text(x + CARD_W / 2, y + 113, char.name, {
      fontSize: '13px', color: '#f4a261', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Unvan
    this.add.text(x + CARD_W / 2, y + 130, char.title, {
      fontSize: '11px', color: '#ffe0b2', fontStyle: 'italic',
    }).setOrigin(0.5);

    // Ayraç
    const sep = this.add.graphics();
    sep.lineStyle(1, 0x555555, 0.6);
    sep.beginPath();
    sep.moveTo(x + 12, y + 144);
    sep.lineTo(x + CARD_W - 12, y + 144);
    sep.strokePath();

    // Açıklama — tek text nesnesi, wordWrap ile kart içinde kalır
    this.add.text(x + CARD_W / 2, y + 153, char.description.join('\n'), {
      fontSize: '10px', color: '#cccccc',
      align: 'center',
      wordWrap: { width: CARD_W - 20 },
      lineSpacing: 4,
    }).setOrigin(0.5, 0);

    // Özel rozet
    let badge = '';
    if (char.startingLives && char.startingLives > 3) badge = '♥ EKSTRA CAN';
    else if (char.wallSlide)           badge = '↑ DUVAR KAYIŞ';
    else if (char.dashStun)            badge = '⚡ DASH ŞOKU';
    else if (char.piercingProjectile)  badge = '→ DELİÇİ MERMİ';
    else if (char.doubleJump)          badge = '^ CIFT ZIPLAMA';
    else if (char.brickFromStart)      badge = '# TUGLA ACIK';
    else if (char.dashCooldown < 1000) badge = '> HIZLI DASH';
    else if (char.jumpVelocity < -400) badge = '^ YUKSEK ZIPLAMA';

    if (badge) {
      const badgeBg = this.add.graphics();
      badgeBg.fillStyle(0x2a2200, 1);
      badgeBg.fillRoundedRect(x + 8, y + CARD_H - 34, CARD_W - 16, 22, 4);
      badgeBg.lineStyle(1, 0x887700, 1);
      badgeBg.strokeRoundedRect(x + 8, y + CARD_H - 34, CARD_W - 16, 22, 4);
      this.add.text(x + CARD_W / 2, y + CARD_H - 23, badge, {
        fontSize: '9px', color: '#ffd700', fontStyle: 'bold',
      }).setOrigin(0.5);
    }

    // Görünmez tıklanabilir alan — Zone alpha'dan etkilenmez
    const zone = this.add.zone(x + CARD_W / 2, y + CARD_H / 2, CARD_W, CARD_H)
      .setInteractive({ useHandCursor: true });

    zone.on('pointerover', () => {
      if (this.selectedIndex !== index) {
        bg.clear();
        bg.fillStyle(0x2a2035, 0.9);
        bg.fillRoundedRect(x, y, CARD_W, CARD_H, 10);
        bg.lineStyle(2, 0x888888, 1);
        bg.strokeRoundedRect(x, y, CARD_W, CARD_H, 10);
      }
    });
    zone.on('pointerout', () => {
      if (this.selectedIndex !== index) {
        bg.clear();
        bg.fillStyle(0x1a1020, 0.9);
        bg.fillRoundedRect(x, y, CARD_W, CARD_H, 10);
        bg.lineStyle(2, 0x555555, 1);
        bg.strokeRoundedRect(x, y, CARD_W, CARD_H, 10);
      }
    });
    zone.on('pointerdown', () => {
      this.selectedIndex = index;
      this.highlightCard(index);
    });
  }

  private highlightCard(selected: number) {
    CHARACTERS.forEach((_, i) => {
      const x = CARDS_START_X + i * (CARD_W + CARD_GAP);
      const bg = this.cardBgs[i];
      bg.clear();
      if (i === selected) {
        bg.fillStyle(0x2a1800, 1);
        bg.fillRoundedRect(x, CARDS_Y, CARD_W, CARD_H, 10);
        bg.lineStyle(3, 0xf4a261, 1);
        bg.strokeRoundedRect(x, CARDS_Y, CARD_W, CARD_H, 10);
      } else {
        bg.fillStyle(0x1a1020, 0.9);
        bg.fillRoundedRect(x, CARDS_Y, CARD_W, CARD_H, 10);
        bg.lineStyle(2, 0x555555, 1);
        bg.strokeRoundedRect(x, CARDS_Y, CARD_W, CARD_H, 10);
      }
    });
  }

  private drawPlayButton() {
    const btnW = 200;
    const btnH = 44;
    const btnX = GAME_WIDTH / 2 - btnW / 2;
    const btnY = CARDS_Y + CARD_H + 30;

    const btnBg = this.add.graphics();
    const draw = (hover: boolean) => {
      btnBg.clear();
      btnBg.fillStyle(hover ? 0xe06400 : 0xc05000, 1);
      btnBg.fillRoundedRect(btnX, btnY, btnW, btnH, 8);
      btnBg.lineStyle(2, 0xf4a261, 1);
      btnBg.strokeRoundedRect(btnX, btnY, btnW, btnH, 8);
    };
    draw(false);

    const txt = this.add.text(GAME_WIDTH / 2, btnY + btnH / 2, '▶  OYNA', {
      fontSize: '22px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btnBg.setInteractive(new Phaser.Geom.Rectangle(btnX, btnY, btnW, btnH), Phaser.Geom.Rectangle.Contains);

    const startGame = () => {
      const char = CHARACTERS[this.selectedIndex];
      this.scene.start('GameScene', {
        level: this.startData.level,
        characterId: char.id,
      });
    };

    btnBg.on('pointerover',  () => { draw(true);  txt.setStyle({ color: '#ffe0b2' }); });
    btnBg.on('pointerout',   () => { draw(false); txt.setStyle({ color: '#ffffff' }); });
    btnBg.on('pointerdown',  startGame);
    txt.on('pointerover',    () => { draw(true);  txt.setStyle({ color: '#ffe0b2' }); });
    txt.on('pointerout',     () => { draw(false); txt.setStyle({ color: '#ffffff' }); });
    txt.on('pointerdown',    startGame);

    this.tweens.add({ targets: [btnBg, txt], y: `+=3`, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  private drawBackButton() {
    const back = this.add.text(20, 12, '← GERİ', {
      fontSize: '14px', color: '#aaaaaa',
    }).setInteractive({ useHandCursor: true });

    back.on('pointerover', () => back.setStyle({ color: '#ffffff' }));
    back.on('pointerout',  () => back.setStyle({ color: '#aaaaaa' }));
    back.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
