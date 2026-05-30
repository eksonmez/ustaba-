import Phaser from 'phaser';

const FRAME_W = 28;
const FRAME_H = 28;

const C = {
  hat:       0x2980b9, // mavi baret
  hatBrim:   0x1a5c8a,
  skin:      0xf5c5a3,
  shirt:     0x7d5a3c, // kahverengi tulum
  shirtShade:0x5a3e28,
  pants:     0x4a3828,
  boot:      0x1a1a1a,
  eye:       0xffffff,
  pupil:     0x000000,
  brow:      0x333333,
  hammerHead:0x555555,
  hammerHandle:0x8b5e3c,
};

function r(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, color: number) {
  g.fillStyle(color);
  g.fillRect(x, y, w, h);
}

function drawHammer(g: Phaser.GameObjects.Graphics, ox: number, legL: number, legR: number, armRaise: number) {
  // Kask
  r(g, ox + 5,  1,  18, 6,  C.hat);
  r(g, ox + 3,  7,  22, 3,  C.hatBrim);
  // Yüz
  r(g, ox + 7,  10, 14, 9,  C.skin);
  // Kaşlar
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
  // Çekiç (sağ kolda)
  r(g, ox + 20, 17 + armRaise, 4, 8,  C.hammerHandle);
  r(g, ox + 18, 14 + armRaise, 8, 5,  C.hammerHead);
  // Sol bacak
  r(g, ox + 7,  28 + legL, 5, 5, C.pants);
  r(g, ox + 6,  33 + legL, 7, 3, C.boot);
  // Sağ bacak
  r(g, ox + 16, 28 + legR, 5, 5, C.pants);
  r(g, ox + 15, 33 + legR, 7, 3, C.boot);
}

export function buildHammerSprite(scene: Phaser.Scene) {
  if (scene.textures.exists('hammer_anim')) return;

  const g = scene.add.graphics();
  // Kare 0: yürüyüş normal
  drawHammer(g, 0 * FRAME_W, 0,  0, 0);
  // Kare 1: sol adım
  drawHammer(g, 1 * FRAME_W, -2, 2, 0);
  // Kare 2: sağ adım
  drawHammer(g, 2 * FRAME_W,  2, -2, 0);
  // Kare 3: fırlatma pozu (kol yukarıda)
  drawHammer(g, 3 * FRAME_W, 0,  0, -6);
  g.generateTexture('hammer_anim', FRAME_W * 4, FRAME_H);
  g.destroy();

  const texture = scene.textures.get('hammer_anim');
  for (let i = 0; i < 4; i++) {
    texture.add(i, 0, i * FRAME_W, 0, FRAME_W, FRAME_H);
  }

  if (!scene.anims.exists('hammer_walk')) {
    scene.anims.create({
      key: 'hammer_walk',
      frames: scene.anims.generateFrameNumbers('hammer_anim', { frames: [1, 0, 2, 0] }),
      frameRate: 5,
      repeat: -1,
    });
  }

  if (!scene.anims.exists('hammer_throw')) {
    scene.anims.create({
      key: 'hammer_throw',
      frames: [{ key: 'hammer_anim', frame: 3 }],
      frameRate: 1,
    });
  }
}

// Çekiç mermisinin texture'ını da burada oluştur
export function buildHammerProjectileTexture(scene: Phaser.Scene) {
  if (scene.textures.exists('enemy_hammer_proj')) return;
  const g = scene.add.graphics();
  g.fillStyle(0x555555);
  g.fillRect(0, 2, 14, 6);  // sap
  g.fillStyle(0x888888);
  g.fillRect(2, 0, 10, 10); // kafa
  g.generateTexture('enemy_hammer_proj', 16, 12);
  g.destroy();
}
