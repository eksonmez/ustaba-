import Phaser from 'phaser';

const FRAME_W = 32;
const FRAME_H = 32;

const C = {
  hat:       0xf4d03f, // sarı baret
  hatBrim:   0xd4ac0d,
  skin:      0xf5c5a3,
  shirt:     0x4a4a4a, // koyu gri tulum
  shirtShade:0x2a2a2a,
  pants:     0x2c2c2c,
  boot:      0x1a1a1a,
  eye:       0xffffff,
  pupil:     0x000000,
  brow:      0x222222,
};

function r(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, color: number) {
  g.fillStyle(color);
  g.fillRect(x, y, w, h);
}

function drawHeavy(g: Phaser.GameObjects.Graphics, ox: number, legL: number, legR: number) {
  // Kask (daha geniş)
  r(g, ox + 4,  1,  24, 7,  C.hat);
  r(g, ox + 2,  8,  28, 3,  C.hatBrim);
  // Yüz (daha geniş)
  r(g, ox + 6,  11, 20, 9,  C.skin);
  // Kaşlar
  r(g, ox + 7,  12,  5, 2,  C.brow);
  r(g, ox + 20, 12,  5, 2,  C.brow);
  // Gözler
  r(g, ox + 8,  14,  4, 3,  C.eye);
  r(g, ox + 20, 14,  4, 3,  C.eye);
  r(g, ox + 9,  15,  2, 2,  C.pupil);
  r(g, ox + 21, 15,  2, 2,  C.pupil);
  // Gövde (daha kalın)
  r(g, ox + 4,  20, 24, 10, C.shirt);
  r(g, ox + 4,  20,  4, 10, C.shirtShade);
  // Sol bacak (kalın)
  r(g, ox + 5,  30 + legL, 8, 6, C.pants);
  r(g, ox + 4,  36 + legL, 9, 3, C.boot);
  // Sağ bacak (kalın)
  r(g, ox + 19, 30 + legR, 8, 6, C.pants);
  r(g, ox + 18, 36 + legR, 9, 3, C.boot);
}

export function buildHeavySprite(scene: Phaser.Scene) {
  if (scene.textures.exists('heavy_anim')) return;

  const g = scene.add.graphics();
  drawHeavy(g, 0 * FRAME_W, 0,  0);
  drawHeavy(g, 1 * FRAME_W, -2, 2);
  drawHeavy(g, 2 * FRAME_W,  2, -2);
  g.generateTexture('heavy_anim', FRAME_W * 3, FRAME_H);
  g.destroy();

  const texture = scene.textures.get('heavy_anim');
  for (let i = 0; i < 3; i++) {
    texture.add(i, 0, i * FRAME_W, 0, FRAME_W, FRAME_H);
  }

  if (!scene.anims.exists('heavy_walk')) {
    scene.anims.create({
      key: 'heavy_walk',
      frames: scene.anims.generateFrameNumbers('heavy_anim', { frames: [1, 0, 2, 0] }),
      frameRate: 4,
      repeat: -1,
    });
  }
}
