import Phaser from 'phaser';

const FRAME_W = 28;
const FRAME_H = 28;

const C = {
  hat:       0xe63946,
  hatBrim:   0xb02030,
  skin:      0xf5c5a3,
  shirt:     0x8b0000,
  shirtShade:0x600000,
  pants:     0x333333,
  boot:      0x1a1a1a,
  eye:       0xffffff,
  pupil:     0x000000,
  brow:      0x333333,
};

function r(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, color: number) {
  g.fillStyle(color);
  g.fillRect(x, y, w, h);
}

function drawEnemy(
  g: Phaser.GameObjects.Graphics,
  ox: number,
  legL: number,
  legR: number
) {
  // Kask
  r(g, ox + 5,  1,  18, 6,  C.hat);
  r(g, ox + 3,  7,  22, 3,  C.hatBrim);
  // Yüz
  r(g, ox + 7,  10, 14, 9,  C.skin);
  // Kaşlar (sinirli)
  r(g, ox + 8,  11,  4, 2,  C.brow);
  r(g, ox + 16, 11,  4, 2,  C.brow);
  // Gözler
  r(g, ox + 9,  13,  3, 3,  C.eye);
  r(g, ox + 16, 13,  3, 3,  C.eye);
  r(g, ox + 10, 14,  2, 2,  C.pupil);
  r(g, ox + 17, 14,  2, 2,  C.pupil);
  // Gövde
  r(g, ox + 6,  19, 16, 9,  C.shirt);
  r(g, ox + 6,  19,  3, 9,  C.shirtShade);
  // Sol bacak
  r(g, ox + 7,  28 + legL, 5, 5, C.pants);
  r(g, ox + 6,  33 + legL, 7, 3, C.boot);
  // Sağ bacak
  r(g, ox + 16, 28 + legR, 5, 5, C.pants);
  r(g, ox + 15, 33 + legR, 7, 3, C.boot);
}

export function buildEnemySprite(scene: Phaser.Scene) {
  if (scene.textures.exists('enemy_anim')) return;

  const g = scene.add.graphics();

  // Kare 0: duruş
  drawEnemy(g, 0 * FRAME_W, 0,  0);
  // Kare 1: sol adım
  drawEnemy(g, 1 * FRAME_W, -2, 2);
  // Kare 2: sağ adım
  drawEnemy(g, 2 * FRAME_W,  2, -2);

  g.generateTexture('enemy_anim', FRAME_W * 3, FRAME_H);
  g.destroy();

  const texture = scene.textures.get('enemy_anim');
  for (let i = 0; i < 3; i++) {
    texture.add(i, 0, i * FRAME_W, 0, FRAME_W, FRAME_H);
  }

  const anims = scene.anims;

  if (!anims.exists('enemy_walk')) {
    anims.create({
      key: 'enemy_walk',
      frames: anims.generateFrameNumbers('enemy_anim', { frames: [1, 0, 2, 0] }),
      frameRate: 6,
      repeat: -1,
    });
  }

  if (!anims.exists('enemy_idle')) {
    anims.create({
      key: 'enemy_idle',
      frames: [{ key: 'enemy_anim', frame: 0 }],
      frameRate: 1,
    });
  }
}
