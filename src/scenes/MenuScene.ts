import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { LEVELS } from '../config/levels';

const DEV_LEVEL_SELECT = true;

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.drawBackground();
    this.drawCitysilhouette();
    this.drawCrane();
    this.drawScaffolding();
    this.addUI();
  }

  private drawBackground() {
    // Alacakaranlık gökyüzü: lacivert üstten turuncu-kırmızıya
    const bg = this.add.graphics();
    const steps = 60;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const r = Math.round(Phaser.Math.Linear(15, 180, t));
      const g = Math.round(Phaser.Math.Linear(20, 80, t));
      const b = Math.round(Phaser.Math.Linear(60, 30, t));
      const color = (r << 16) | (g << 8) | b;
      const sliceH = GAME_HEIGHT / steps;
      bg.fillStyle(color, 1);
      bg.fillRect(0, i * sliceH, GAME_WIDTH, sliceH + 1);
    }

    // Parlayan yıldızlar — her biri ayrı nesne, farklı titreşim tweeni
    const rng = new Phaser.Math.RandomDataGenerator(['ustabasi-menu']);
    for (let i = 0; i < 60; i++) {
      const x = rng.between(0, GAME_WIDTH);
      const y = rng.between(0, GAME_HEIGHT * 0.52);
      const r2 = rng.between(1, 2);
      const star = this.add.graphics();
      star.fillStyle(0xffffff, 1);
      star.fillCircle(x, y, r2);
      // Her yıldıza rastgele gecikme ve süre
      this.tweens.add({
        targets: star,
        alpha: { from: 0.15, to: 1 },
        duration: rng.between(800, 2400),
        delay: rng.between(0, 2000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Ufuk çizgisinde turuncu/sarı parlaması
    const glow = this.add.graphics();
    glow.fillGradientStyle(0xff6b00, 0xff6b00, 0xf4a261, 0xf4a261, 0.0, 0.0, 0.35, 0.35);
    glow.fillRect(0, GAME_HEIGHT * 0.48, GAME_WIDTH, GAME_HEIGHT * 0.12);
  }

  private drawCitysilhouette() {
    // Arka planda koyu bina silüetleri
    const g = this.add.graphics();
    g.fillStyle(0x0a0a1a, 1);

    const buildings = [
      { x: 0,   w: 80,  h: 160 },
      { x: 70,  w: 60,  h: 220 },
      { x: 120, w: 90,  h: 140 },
      { x: 200, w: 50,  h: 260 },
      { x: 240, w: 100, h: 180 },
      { x: 330, w: 70,  h: 300 },
      { x: 390, w: 80,  h: 200 },
      { x: 460, w: 55,  h: 240 },
      { x: 505, w: 90,  h: 170 },
      { x: 590, w: 65,  h: 280 },
      { x: 645, w: 85,  h: 190 },
      { x: 720, w: 80,  h: 250 },
    ];

    const groundY = GAME_HEIGHT * 0.6;
    for (const b of buildings) {
      g.fillRect(b.x, groundY - b.h, b.w, b.h + GAME_HEIGHT);
    }

    // Binalardaki küçük pencere ışıkları
    const lights = this.add.graphics();
    const rng = new Phaser.Math.RandomDataGenerator(['ustabasi-lights']);
    for (const b of buildings) {
      const cols = Math.floor(b.w / 14);
      const rows = Math.floor(b.h / 18);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (rng.frac() > 0.45) continue;
          const wx = b.x + 4 + col * 14;
          const wy = groundY - b.h + 6 + row * 18;
          const warm = rng.frac() > 0.4;
          lights.fillStyle(warm ? 0xffe066 : 0x88ccff, 0.7);
          lights.fillRect(wx, wy, 7, 9);
        }
      }
    }
  }

  private drawCrane() {
    const bx = 690;
    const groundY = GAME_HEIGHT * 0.6;
    const towerTop = groundY - 220;

    // Statik: kule gövdesi + kollar
    const g = this.add.graphics();
    g.fillStyle(0xb0b0b0, 0.9);
    g.fillRect(bx, towerTop, 10, 220);
    g.fillRect(bx - 120, towerTop, 140, 8);
    g.fillRect(bx + 10, towerTop + 4, 40, 6);

    // Halat bağlantı noktası — vinç kolu boyunca sola gidecek
    const ropeAnchorY = towerTop + 8;
    const ropeLen = 55;

    // Animasyonlu: halat + yük kutusu — container ile birlikte hareket eder
    const loadContainer = this.add.container(bx - 80, ropeAnchorY);

    const rope = this.add.graphics();
    rope.lineStyle(1.5, 0xaaaaaa, 0.85);
    rope.beginPath();
    rope.moveTo(0, 0);
    rope.lineTo(0, ropeLen);
    rope.strokePath();

    const box = this.add.graphics();
    box.fillStyle(0xf4a261, 1);
    box.fillRect(-14, ropeLen, 28, 20);
    box.lineStyle(1, 0xc07030, 1);
    box.strokeRect(-14, ropeLen, 28, 20);

    loadContainer.add([rope, box]);

    // Sarkacı andıran yavaş sallanma
    this.tweens.add({
      targets: loadContainer,
      x: bx - 80 + 18,
      duration: 2800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Vinç kolu boyunca ileri-geri kayan ray noktası (troli)
    const trolley = this.add.graphics();
    trolley.fillStyle(0x888888, 1);
    trolley.fillRect(-6, -4, 12, 8);
    trolley.setPosition(bx - 80, towerTop + 4);

    this.tweens.add({
      targets: trolley,
      x: bx - 20,
      duration: 3200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        // Halat + kutu troli ile birlikte kayar
        loadContainer.x = trolley.x;
      },
    });
  }

  private drawScaffolding() {
    const groundY = GAME_HEIGHT * 0.6;
    const sfX = 30;
    const sfW = 160;
    const sfH = 180;
    const cols = 4;
    const rows = 4;
    const cw = sfW / cols;
    const rh = sfH / rows;

    // Zemin önce çizilsin (en altta)
    const ground = this.add.graphics();
    ground.fillStyle(0x2a1a0a, 1);
    ground.fillRect(0, groundY, GAME_WIDTH, GAME_HEIGHT * 0.4);
    ground.lineStyle(1, 0x3a2a1a, 0.5);
    for (let i = 0; i < 6; i++) {
      ground.beginPath();
      ground.moveTo(0, groundY + i * 14);
      ground.lineTo(GAME_WIDTH, groundY + i * 14);
      ground.strokePath();
    }

    // İskele kafesi
    const g = this.add.graphics();
    g.lineStyle(2, 0x8b6914, 0.6);
    for (let c = 0; c <= cols; c++) {
      g.beginPath();
      g.moveTo(sfX + c * cw, groundY);
      g.lineTo(sfX + c * cw, groundY - sfH);
      g.strokePath();
    }
    for (let r = 0; r <= rows; r++) {
      g.beginPath();
      g.moveTo(sfX, groundY - r * rh);
      g.lineTo(sfX + sfW, groundY - r * rh);
      g.strokePath();
    }
    g.lineStyle(1, 0x8b6914, 0.3);
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x0 = sfX + c * cw;
        const y0 = groundY - r * rh;
        g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + cw, y0 - rh); g.strokePath();
        g.beginPath(); g.moveTo(x0 + cw, y0); g.lineTo(x0, y0 - rh); g.strokePath();
      }
    }

    // İşçi 1 — ikinci platformda çalışıyor
    this.addWorker(sfX + cw * 1.2, groundY - rh * 2, 0xffcc00, 0);
    // İşçi 2 — üst platformda, gecikmeli
    this.addWorker(sfX + cw * 2.8, groundY - rh * 3, 0xff8800, 700);
  }

  private addWorker(x: number, y: number, helmetColor: number, delay: number) {
    // Gövde + bacaklar + kafa (statik)
    const body = this.add.graphics();
    body.fillStyle(0x3355aa, 1);
    body.fillRect(x - 4, y - 14, 8, 10);   // gövde
    body.fillStyle(0x223377, 1);
    body.fillRect(x - 4, y - 4, 3, 6);     // sol bacak
    body.fillRect(x + 1,  y - 4, 3, 6);    // sağ bacak
    body.fillStyle(0xf5cba7, 1);
    body.fillCircle(x, y - 19, 4);          // kafa
    body.fillStyle(helmetColor, 1);
    body.fillRect(x - 5, y - 24, 10, 3);   // baret ağzı
    body.fillRect(x - 3, y - 28, 6, 5);    // baret tepesi

    // Kol + çekiç ayrı container — pivot omuz noktasından döner
    const armContainer = this.add.container(x + 4, y - 12);
    const arm = this.add.graphics();
    arm.fillStyle(0xf5cba7, 1);
    arm.fillRect(0, 0, 3, 9);              // kol
    arm.fillStyle(0x555555, 1);
    arm.fillRect(-3, 8, 9, 4);            // çekiç başı
    arm.fillRect(1, 5, 2, 4);             // çekiç sapı üst
    armContainer.add(arm);

    // Çekiç vurma animasyonu: yukarı kalk → aşağı vur → kısa bekle
    this.tweens.add({
      targets: armContainer,
      angle: { from: -60, to: 30 },
      duration: 320,
      delay,
      yoyo: true,
      hold: 120,        // aşağıda kısa dur (vurdu hissi)
      repeatDelay: 200,
      repeat: -1,
      ease: 'Quad.easeIn',
    });
  }

  private addUI() {
    const cy = GAME_HEIGHT * 0.6;

    // Başlık gölgesi
    this.add.text(GAME_WIDTH / 2 + 3, cy - 175 + 3, 'USTABAŞI', {
      fontSize: '52px', color: '#7a3a00', fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0.5);

    // Başlık
    const title = this.add.text(GAME_WIDTH / 2, cy - 175, 'USTABAŞI', {
      fontSize: '52px', color: '#f4a261', fontStyle: 'bold',
      stroke: '#7a3a00', strokeThickness: 4,
    }).setOrigin(0.5);

    // Başlık hafif yukarı-aşağı sallanma
    this.tweens.add({
      targets: title,
      y: cy - 178,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Alt başlık
    this.add.text(GAME_WIDTH / 2 + 2, cy - 120 + 2, 'İnşaatın Patronu Sensin', {
      fontSize: '17px', color: '#7a3a00', fontStyle: 'bold italic',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, cy - 120, 'İnşaatın Patronu Sensin', {
      fontSize: '17px', color: '#ffe0b2', fontStyle: 'bold italic',
      stroke: '#c06000', strokeThickness: 3,
    }).setOrigin(0.5);

    // Başla butonu
    // Buton arka planı — ayrı graphics nesnesi, tam opak
    const btnW = 220;
    const btnH = 46;
    const btnX = GAME_WIDTH / 2 - btnW / 2;
    const btnY = cy - 68 - btnH / 2;
    const btnBg = this.add.graphics();
    const drawBtn = (hover: boolean) => {
      btnBg.clear();
      btnBg.fillStyle(hover ? 0xe06400 : 0xc05000, 1);
      btnBg.fillRoundedRect(btnX, btnY, btnW, btnH, 8);
      btnBg.lineStyle(2, 0xf4a261, 1);
      btnBg.strokeRoundedRect(btnX, btnY, btnW, btnH, 8);
    };
    drawBtn(false);

    const startText = this.add.text(GAME_WIDTH / 2, cy - 68, '▶  BAŞTAN OYNA', {
      fontSize: '22px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    btnBg.setInteractive(new Phaser.Geom.Rectangle(btnX, btnY, btnW, btnH), Phaser.Geom.Rectangle.Contains);

    btnBg.on('pointerover',  () => { drawBtn(true);  startText.setStyle({ color: '#ffe0b2' }); });
    btnBg.on('pointerout',   () => { drawBtn(false); startText.setStyle({ color: '#ffffff' }); });
    btnBg.on('pointerdown',  () => this.scene.start('GameScene', { level: 0, lives: 3 }));
    startText.on('pointerover',  () => { drawBtn(true);  startText.setStyle({ color: '#ffe0b2' }); });
    startText.on('pointerout',   () => { drawBtn(false); startText.setStyle({ color: '#ffffff' }); });

    // Buton hafifçe yukarı-aşağı nefes alır
    this.tweens.add({
      targets: [btnBg, startText],
      y: `+=${3}`,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    startText.on('pointerdown', () => this.scene.start('GameScene', { level: 0, lives: 3 }));

    if (DEV_LEVEL_SELECT) {
      this.add.text(GAME_WIDTH / 2, cy - 24, '— TEST: Bölüm Seç —', {
        fontSize: '13px', color: '#ffaa00',
      }).setOrigin(0.5);

      const cols = 3;
      const btnW = 80;
      const btnH = 32;
      const pad  = 14;
      const totalW = cols * btnW + (cols - 1) * pad;
      const startX = GAME_WIDTH / 2 - totalW / 2;
      const startY = cy;

      LEVELS.forEach((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (btnW + pad);
        const y = startY + row * (btnH + 10);

        const bg = this.add.rectangle(x + btnW / 2, y + btnH / 2, btnW, btnH, 0x333333)
          .setInteractive({ useHandCursor: true });

        this.add.text(x + btnW / 2, y + btnH / 2, `Bölüm ${i + 1}`, {
          fontSize: '13px', color: '#ffffff',
        }).setOrigin(0.5);

        bg.on('pointerover',  () => bg.setFillStyle(0x555555));
        bg.on('pointerout',   () => bg.setFillStyle(0x333333));
        bg.on('pointerdown',  () => this.scene.start('GameScene', { level: i, lives: 3 }));
      });
    }
  }
}
