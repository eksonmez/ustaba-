import Phaser from 'phaser';

const FRAME_W = 32;
const FRAME_H = 40;
const FRAMES = 5;

const C = {
  hat:        0xffd700, // sarı baret
  hatBrim:    0xe6c000,
  hatShadow:  0xb89600,
  skin:       0xffcc99,
  skinShade:  0xe8a870,
  eye:        0x222222,
  eyeWhite:   0xffffff,
  mustache:   0x5c2d00,
  overalls:   0xe8620a, // turuncu tulum
  ovShade:    0xb04500,
  shirt:      0xfff0a0, // sarımsı gömlek
  pants:      0x1a3a6b,
  pantsShade: 0x0f2550,
  boot:       0x3a1a00,
  bootSole:   0x1a0800,
  outline:    0x111111,
};

function r(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, color: number) {
  g.fillStyle(color);
  g.fillRect(x, y, w, h);
}

// Büyük yuvarlak kafa + baret (sağa bakıyor)
function drawHead(g: Phaser.GameObjects.Graphics, ox: number, oy: number) {
  // Baret gölgesi
  r(g, ox + 4,  oy,      24, 10, C.hatShadow);
  // Baret ana renk
  r(g, ox + 5,  oy,      22, 9,  C.hat);
  // Baret kenarı (geniş)
  r(g, ox + 2,  oy + 8,  28, 4,  C.hatBrim);
  r(g, ox + 3,  oy + 9,  26, 3,  C.hat);
  // Yuvarlak yüz
  r(g, ox + 5,  oy + 11, 22, 14, C.skin);
  r(g, ox + 4,  oy + 12, 24, 12, C.skin); // yanları doldur
  // Yanak gölgesi
  r(g, ox + 5,  oy + 19, 4,  4,  C.skinShade);
  // Göz (sağa bakıyor, tek göz görünür)
  r(g, ox + 19, oy + 14, 5, 5,   C.eyeWhite);
  r(g, ox + 21, oy + 15, 3, 4,   C.eye);
  r(g, ox + 22, oy + 15, 1, 1,   0xffffff); // parıltı
  // Bıyık
  r(g, ox + 10, oy + 20, 14, 3,  C.mustache);
  r(g, ox + 11, oy + 21, 12, 2,  C.mustache);
}

// Gövde (overalls tarzı)
function drawBody(g: Phaser.GameObjects.Graphics, ox: number, oy: number, bodyH: number = 10) {
  // Gömlek kolları altında görünür
  r(g, ox + 1,  oy,      4, bodyH,     C.shirt);
  r(g, ox + 27, oy,      4, bodyH,     C.shirt);
  // Overalls gövde
  r(g, ox + 5,  oy,      22, bodyH,    C.overalls);
  r(g, ox + 5,  oy,      3,  bodyH,    C.ovShade);
  // Önlük çizgisi
  r(g, ox + 12, oy + 1,  8,  bodyH - 2, C.shirt);
  // Overalls askısı (çizgi)
  r(g, ox + 11, oy,      2,  4,         C.overalls);
  r(g, ox + 19, oy,      2,  4,         C.overalls);
}

// Kol
function drawArm(g: Phaser.GameObjects.Graphics, ox: number, oy: number, isLeft: boolean, swing: number) {
  const ax = isLeft ? ox + 1 : ox + 26;
  r(g, ax, oy + swing,     4, 8, C.shirt);
  r(g, ax, oy + 8 + swing, 4, 3, C.skin);   // el
}

// Normal bacaklar
function drawLegs(g: Phaser.GameObjects.Graphics, ox: number, oy: number, lOff: number, rOff: number) {
  // Sol bacak
  r(g, ox + 5,  oy + lOff, 9,  6, C.pants);
  r(g, ox + 4,  oy + lOff, 2,  6, C.pantsShade);
  r(g, ox + 3,  oy + 6 + lOff, 12, 4, C.boot);
  r(g, ox + 3,  oy + 9 + lOff,  12, 1, C.bootSole);
  // Sağ bacak
  r(g, ox + 18, oy + rOff, 9,  6, C.pantsShade);
  r(g, ox + 17, oy + 6 + rOff, 12, 4, C.boot);
  r(g, ox + 17, oy + 9 + rOff, 12, 1, C.bootSole);
}

// --- 5 Kare ---

function frameIdle(g: Phaser.GameObjects.Graphics, ox: number) {
  drawHead(g, ox, 0);
  drawBody(g, ox, 25);
  drawArm(g, ox, 25, true,  0);
  drawArm(g, ox, 25, false, 0);
  drawLegs(g, ox, 29, 0, 0);  // uzatılmış bacaklar sadece kısmı göster
  // Bot düzeltme — tam boy
  r(g, ox + 3,  35, 12, 4, C.boot);
  r(g, ox + 3,  38, 12, 1, C.bootSole);
  r(g, ox + 17, 35, 12, 4, C.boot);
  r(g, ox + 17, 38, 12, 1, C.bootSole);
}

function frameWalk1(g: Phaser.GameObjects.Graphics, ox: number) {
  drawHead(g, ox, 0);
  drawBody(g, ox, 24);
  drawArm(g, ox, 24, true,  -4);
  drawArm(g, ox, 24, false,  3);
  // Sol bacak ileri
  r(g, ox + 5,  29, 9, 7, C.pants);
  r(g, ox + 3,  35, 12, 4, C.boot);
  r(g, ox + 3,  38, 12, 1, C.bootSole);
  // Sağ bacak geri
  r(g, ox + 18, 32, 9, 4, C.pantsShade);
  r(g, ox + 17, 35, 10, 4, C.boot);
  r(g, ox + 17, 38, 10, 1, C.bootSole);
}

function frameWalk2(g: Phaser.GameObjects.Graphics, ox: number) {
  drawHead(g, ox, 0);
  drawBody(g, ox, 24);
  drawArm(g, ox, 24, true,   3);
  drawArm(g, ox, 24, false, -4);
  // Sol bacak geri
  r(g, ox + 5,  32, 9, 4, C.pants);
  r(g, ox + 4,  35, 10, 4, C.boot);
  r(g, ox + 4,  38, 10, 1, C.bootSole);
  // Sağ bacak ileri
  r(g, ox + 18, 29, 9, 7, C.pantsShade);
  r(g, ox + 17, 35, 12, 4, C.boot);
  r(g, ox + 17, 38, 12, 1, C.bootSole);
}

function frameJump(g: Phaser.GameObjects.Graphics, ox: number) {
  drawHead(g, ox, 0);
  drawBody(g, ox, 24);
  // Kollar yukarı
  drawArm(g, ox, 24, true,  -6);
  drawArm(g, ox, 24, false, -6);
  // Dizler kıvrık — bacaklar yukarı çekilmiş, botlar yana
  r(g, ox + 4,  28, 9, 6, C.pants);
  r(g, ox + 2,  31, 11, 5, C.boot);   // sol bot yana
  r(g, ox + 2,  35, 11, 1, C.bootSole);
  r(g, ox + 19, 28, 9, 6, C.pantsShade);
  r(g, ox + 19, 31, 11, 5, C.boot);   // sağ bot yana
  r(g, ox + 19, 35, 11, 1, C.bootSole);
}

function frameLand(g: Phaser.GameObjects.Graphics, ox: number) {
  // Tüm vücut 4px aşağı çökmüş, gövde basık
  drawHead(g, ox, 4);
  drawBody(g, ox, 27, 7);
  // Kollar yana açık
  r(g, ox - 2, 28, 5, 6, C.shirt);
  r(g, ox + 29, 28, 5, 6, C.shirt);
  // Dizler yana açık — derin çöküş
  r(g, ox + 3,  33, 11, 4, C.pants);
  r(g, ox + 1,  35, 14, 4, C.boot);
  r(g, ox + 1,  38, 14, 1, C.bootSole);
  r(g, ox + 18, 33, 11, 4, C.pantsShade);
  r(g, ox + 17, 35, 14, 4, C.boot);
  r(g, ox + 17, 38, 14, 1, C.bootSole);
}

export function buildWorkerSprite(scene: Phaser.Scene) {
  if (scene.textures.exists('worker')) return;

  const g = scene.add.graphics();

  frameIdle( g, 0 * FRAME_W);
  frameWalk1(g, 1 * FRAME_W);
  frameWalk2(g, 2 * FRAME_W);
  frameJump( g, 3 * FRAME_W);
  frameLand( g, 4 * FRAME_W);

  g.generateTexture('worker', FRAME_W * FRAMES, FRAME_H);
  g.destroy();

  const texture = scene.textures.get('worker');
  for (let i = 0; i < FRAMES; i++) {
    texture.add(i, 0, i * FRAME_W, 0, FRAME_W, FRAME_H);
  }

  const anims = scene.anims;
  if (!anims.exists('worker_idle')) {
    anims.create({ key: 'worker_idle', frames: [{ key: 'worker', frame: 0 }], frameRate: 1 });
  }
  if (!anims.exists('worker_walk')) {
    anims.create({
      key: 'worker_walk',
      frames: anims.generateFrameNumbers('worker', { frames: [1, 0, 2, 0] }),
      frameRate: 8,
      repeat: -1,
    });
  }
  if (!anims.exists('worker_jump')) {
    anims.create({ key: 'worker_jump', frames: [{ key: 'worker', frame: 3 }], frameRate: 1 });
  }
  if (!anims.exists('worker_land')) {
    anims.create({ key: 'worker_land', frames: [{ key: 'worker', frame: 4 }], frameRate: 1 });
  }
}
