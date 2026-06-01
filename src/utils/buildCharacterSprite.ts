import Phaser from 'phaser';
import { CharacterColors } from '../types/CharacterConfig';

const FRAME_W = 32;
const FRAME_H = 40;
const FRAMES = 5;

const BASE = {
  skin:       0xffcc99,
  skinShade:  0xe8a870,
  eye:        0x222222,
  eyeWhite:   0xffffff,
  mustache:   0x5c2d00,
  shirt:      0xfff0a0,
  pants:      0x1a3a6b,
  pantsShade: 0x0f2550,
  boot:       0x3a1a00,
  bootSole:   0x1a0800,
};

function r(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, color: number) {
  g.fillStyle(color);
  g.fillRect(x, y, w, h);
}

function drawHead(g: Phaser.GameObjects.Graphics, ox: number, oy: number, C: CharacterColors) {
  r(g, ox + 4,  oy,      24, 10, C.hatShadow);
  r(g, ox + 5,  oy,      22, 9,  C.hat);
  r(g, ox + 2,  oy + 8,  28, 4,  C.hatBrim);
  r(g, ox + 3,  oy + 9,  26, 3,  C.hat);
  r(g, ox + 5,  oy + 11, 22, 14, BASE.skin);
  r(g, ox + 4,  oy + 12, 24, 12, BASE.skin);
  r(g, ox + 5,  oy + 19, 4,  4,  BASE.skinShade);
  r(g, ox + 19, oy + 14, 5, 5,   BASE.eyeWhite);
  r(g, ox + 21, oy + 15, 3, 4,   BASE.eye);
  r(g, ox + 22, oy + 15, 1, 1,   0xffffff);
  r(g, ox + 10, oy + 20, 14, 3,  BASE.mustache);
  r(g, ox + 11, oy + 21, 12, 2,  BASE.mustache);
}

function drawBody(g: Phaser.GameObjects.Graphics, ox: number, oy: number, C: CharacterColors, bodyH: number = 10) {
  r(g, ox + 1,  oy,      4, bodyH,     BASE.shirt);
  r(g, ox + 27, oy,      4, bodyH,     BASE.shirt);
  r(g, ox + 5,  oy,      22, bodyH,    C.overalls);
  r(g, ox + 5,  oy,      3,  bodyH,    C.ovShade);
  r(g, ox + 12, oy + 1,  8,  bodyH - 2, BASE.shirt);
  r(g, ox + 11, oy,      2,  4,         C.overalls);
  r(g, ox + 19, oy,      2,  4,         C.overalls);
}

function drawArm(g: Phaser.GameObjects.Graphics, ox: number, oy: number, isLeft: boolean, swing: number) {
  const ax = isLeft ? ox + 1 : ox + 26;
  r(g, ax, oy + swing,     4, 8, BASE.shirt);
  r(g, ax, oy + 8 + swing, 4, 3, BASE.skin);
}

function drawLegs(g: Phaser.GameObjects.Graphics, ox: number, oy: number, lOff: number, rOff: number) {
  r(g, ox + 5,  oy + lOff, 9,  6, BASE.pants);
  r(g, ox + 4,  oy + lOff, 2,  6, BASE.pantsShade);
  r(g, ox + 3,  oy + 6 + lOff, 12, 4, BASE.boot);
  r(g, ox + 3,  oy + 9 + lOff,  12, 1, BASE.bootSole);
  r(g, ox + 18, oy + rOff, 9,  6, BASE.pantsShade);
  r(g, ox + 17, oy + 6 + rOff, 12, 4, BASE.boot);
  r(g, ox + 17, oy + 9 + rOff, 12, 1, BASE.bootSole);
}

function frameIdle(g: Phaser.GameObjects.Graphics, ox: number, C: CharacterColors) {
  drawHead(g, ox, 0, C);
  drawBody(g, ox, 25, C);
  drawArm(g, ox, 25, true,  0);
  drawArm(g, ox, 25, false, 0);
  drawLegs(g, ox, 29, 0, 0);
  r(g, ox + 3,  35, 12, 4, BASE.boot);
  r(g, ox + 3,  38, 12, 1, BASE.bootSole);
  r(g, ox + 17, 35, 12, 4, BASE.boot);
  r(g, ox + 17, 38, 12, 1, BASE.bootSole);
}

function frameWalk1(g: Phaser.GameObjects.Graphics, ox: number, C: CharacterColors) {
  drawHead(g, ox, 0, C);
  drawBody(g, ox, 24, C);
  drawArm(g, ox, 24, true,  -4);
  drawArm(g, ox, 24, false,  3);
  r(g, ox + 5,  29, 9, 7, BASE.pants);
  r(g, ox + 3,  35, 12, 4, BASE.boot);
  r(g, ox + 3,  38, 12, 1, BASE.bootSole);
  r(g, ox + 18, 32, 9, 4, BASE.pantsShade);
  r(g, ox + 17, 35, 10, 4, BASE.boot);
  r(g, ox + 17, 38, 10, 1, BASE.bootSole);
}

function frameWalk2(g: Phaser.GameObjects.Graphics, ox: number, C: CharacterColors) {
  drawHead(g, ox, 0, C);
  drawBody(g, ox, 24, C);
  drawArm(g, ox, 24, true,   3);
  drawArm(g, ox, 24, false, -4);
  r(g, ox + 5,  32, 9, 4, BASE.pants);
  r(g, ox + 4,  35, 10, 4, BASE.boot);
  r(g, ox + 4,  38, 10, 1, BASE.bootSole);
  r(g, ox + 18, 29, 9, 7, BASE.pantsShade);
  r(g, ox + 17, 35, 12, 4, BASE.boot);
  r(g, ox + 17, 38, 12, 1, BASE.bootSole);
}

function frameJump(g: Phaser.GameObjects.Graphics, ox: number, C: CharacterColors) {
  drawHead(g, ox, 0, C);
  drawBody(g, ox, 24, C);
  drawArm(g, ox, 24, true,  -6);
  drawArm(g, ox, 24, false, -6);
  r(g, ox + 4,  28, 9, 6, BASE.pants);
  r(g, ox + 2,  31, 11, 5, BASE.boot);
  r(g, ox + 2,  35, 11, 1, BASE.bootSole);
  r(g, ox + 19, 28, 9, 6, BASE.pantsShade);
  r(g, ox + 19, 31, 11, 5, BASE.boot);
  r(g, ox + 19, 35, 11, 1, BASE.bootSole);
}

function frameLand(g: Phaser.GameObjects.Graphics, ox: number, C: CharacterColors) {
  drawHead(g, ox, 4, C);
  drawBody(g, ox, 27, C, 7);
  r(g, ox - 2, 28, 5, 6, BASE.shirt);
  r(g, ox + 29, 28, 5, 6, BASE.shirt);
  r(g, ox + 3,  33, 11, 4, BASE.pants);
  r(g, ox + 1,  35, 14, 4, BASE.boot);
  r(g, ox + 1,  38, 14, 1, BASE.bootSole);
  r(g, ox + 18, 33, 11, 4, BASE.pantsShade);
  r(g, ox + 17, 35, 14, 4, BASE.boot);
  r(g, ox + 17, 38, 14, 1, BASE.bootSole);
}

export function buildCharacterSprite(scene: Phaser.Scene, textureKey: string, colors: CharacterColors) {
  if (scene.textures.exists(textureKey)) return;

  const g = scene.add.graphics();

  frameIdle( g, 0 * FRAME_W, colors);
  frameWalk1(g, 1 * FRAME_W, colors);
  frameWalk2(g, 2 * FRAME_W, colors);
  frameJump( g, 3 * FRAME_W, colors);
  frameLand( g, 4 * FRAME_W, colors);

  g.generateTexture(textureKey, FRAME_W * FRAMES, FRAME_H);
  g.destroy();

  const texture = scene.textures.get(textureKey);
  for (let i = 0; i < FRAMES; i++) {
    texture.add(i, 0, i * FRAME_W, 0, FRAME_W, FRAME_H);
  }

  const anims = scene.anims;
  const k = textureKey;
  if (!anims.exists(`${k}_idle`)) {
    anims.create({ key: `${k}_idle`, frames: [{ key: k, frame: 0 }], frameRate: 1 });
  }
  if (!anims.exists(`${k}_walk`)) {
    anims.create({
      key: `${k}_walk`,
      frames: anims.generateFrameNumbers(k, { frames: [1, 0, 2, 0] }),
      frameRate: 8,
      repeat: -1,
    });
  }
  if (!anims.exists(`${k}_jump`)) {
    anims.create({ key: `${k}_jump`, frames: [{ key: k, frame: 3 }], frameRate: 1 });
  }
  if (!anims.exists(`${k}_land`)) {
    anims.create({ key: `${k}_land`, frames: [{ key: k, frame: 4 }], frameRate: 1 });
  }
}
