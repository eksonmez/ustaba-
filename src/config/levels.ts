import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export interface PlatformDef { x: number; y: number; w: number; h: number; color: number; }
export interface MovingPlatformDef extends PlatformDef { moveType: 'horizontal' | 'vertical'; range: number; speed: number; }
export interface CollectibleDef { x: number; y: number; }
export type EnemyType = 'runner' | 'heavy' | 'hammer';
export interface EnemyDef { x: number; y: number; range: number; type?: EnemyType; }

export interface LevelConfig {
  playerStart: { x: number; y: number };
  platforms: PlatformDef[];
  movingPlatforms?: MovingPlatformDef[];
  collectibles: CollectibleDef[];
  spawnPool: EnemyDef[];   // olası spawn noktaları havuzu
  spawnCount: number;      // her oyunda kaç tanesi seçilsin
}

const GROUND  = 0x6b4226;
const PLAT    = 0x8b6914;
const PLAT2   = 0x5a7a3a;

export const LEVELS: LevelConfig[] = [
  // --- Bölüm 1 ---
  {
    playerStart: { x: 80, y: GAME_HEIGHT - 100 },
    platforms: [
      { x: 0,   y: GAME_HEIGHT - 32, w: GAME_WIDTH, h: 32, color: GROUND },
      { x: 150, y: 380, w: 160, h: 20, color: PLAT },
      { x: 400, y: 300, w: 160, h: 20, color: PLAT },
      { x: 600, y: 220, w: 160, h: 20, color: PLAT },
      { x: 250, y: 160, w: 160, h: 20, color: PLAT },
    ],
    collectibles: [
      { x: 230, y: 350 },
      { x: 480, y: 270 },
      { x: 680, y: 190 },
      { x: 330, y: 130 },
      { x: 350, y: 440 },
    ],
    spawnPool: [
      { x: 380, y: GAME_HEIGHT - 80, range: 100 },
      { x: 560, y: GAME_HEIGHT - 80, range: 80  },
      { x: 480, y: 270,              range: 60  },
      { x: 680, y: 190,              range: 50  },
      { x: 330, y: 130,              range: 50  },
      { x: 650, y: GAME_HEIGHT - 80, range: 70  },
      { x: 230, y: 270,              range: 50  },
    ],
    spawnCount: 3,
  },

  // --- Bölüm 2 ---
  {
    playerStart: { x: 80, y: GAME_HEIGHT - 100 },
    platforms: [
      { x: 0,   y: GAME_HEIGHT - 32, w: GAME_WIDTH, h: 32, color: GROUND },
      { x: 80,  y: 400, w: 120, h: 20, color: PLAT2 },
      { x: 280, y: 330, w: 120, h: 20, color: PLAT2 },
      { x: 460, y: 260, w: 100, h: 20, color: PLAT2 },
      { x: 620, y: 330, w: 120, h: 20, color: PLAT2 },
      { x: 330, y: 180, w: 140, h: 20, color: PLAT2 },
      { x: 100, y: 250, w: 100, h: 20, color: PLAT2 },
      { x: 580, y: 140, w: 120, h: 20, color: PLAT2 },
    ],
    collectibles: [
      { x: 120, y: 370 },
      { x: 320, y: 300 },
      { x: 500, y: 230 },
      { x: 660, y: 300 },
      { x: 390, y: 150 },
      { x: 150, y: 220 },
      { x: 630, y: 110 },
    ],
    spawnPool: [
      { x: 400, y: GAME_HEIGHT - 80, range: 120 },
      { x: 650, y: GAME_HEIGHT - 80, range: 100 },
      { x: 320, y: 300,              range: 80  },
      { x: 650, y: 300,              range: 60  },
      { x: 400, y: 150,              range: 60  },
      { x: 500, y: 230,              range: 60  },
      { x: 150, y: 220,              range: 50  },
      { x: 630, y: 110,              range: 50  },
    ],
    spawnCount: 4,
  },

  // --- Bölüm 3 ---
  {
    playerStart: { x: 60, y: GAME_HEIGHT - 100 },
    platforms: [
      { x: 0,   y: GAME_HEIGHT - 32, w: GAME_WIDTH, h: 32, color: GROUND },
      { x: 60,  y: 395, w: 140, h: 20, color: PLAT  },
      { x: 340, y: 395, w: 140, h: 20, color: PLAT2 },
      { x: 600, y: 395, w: 160, h: 20, color: PLAT  },
      { x: 180, y: 322, w: 130, h: 20, color: PLAT2 },
      { x: 470, y: 322, w: 130, h: 20, color: PLAT  },
      { x: 60,  y: 249, w: 130, h: 20, color: PLAT  },
      { x: 340, y: 249, w: 130, h: 20, color: PLAT2 },
      { x: 610, y: 249, w: 130, h: 20, color: PLAT  },
      { x: 220, y: 176, w: 160, h: 20, color: PLAT2 },
      { x: 490, y: 176, w: 160, h: 20, color: PLAT  },
    ],
    collectibles: [
      { x: 110, y: 365 }, { x: 400, y: 365 }, { x: 665, y: 365 },
      { x: 235, y: 292 }, { x: 525, y: 292 },
      { x: 110, y: 219 }, { x: 395, y: 219 }, { x: 660, y: 219 },
      { x: 285, y: 146 }, { x: 555, y: 146 },
    ],
    spawnPool: [
      { x: 400, y: GAME_HEIGHT - 80, range: 100 },
      { x: 650, y: GAME_HEIGHT - 80, range: 80  },
      { x: 540, y: 295,              range: 60  },
      { x: 240, y: 295,              range: 60  },
      { x: 400, y: 222,              range: 70  },
      { x: 670, y: 222,              range: 50  },
      { x: 555, y: 149,              range: 60  },
      { x: 290, y: 149,              range: 50  },
      { x: 670, y: 368,              range: 60,  type: 'hammer' },
      { x: 410, y: 368,              range: 50,  type: 'hammer' },
    ],
    spawnCount: 5,
  },

  // --- Bölüm 4 ---
  {
    playerStart: { x: 60, y: GAME_HEIGHT - 100 },
    platforms: [
      { x: 0,   y: GAME_HEIGHT - 32, w: GAME_WIDTH, h: 32, color: GROUND },
      { x: 40,  y: 390, w: 130, h: 20, color: PLAT  },
      { x: 630, y: 390, w: 130, h: 20, color: PLAT  },
      { x: 40,  y: 230, w: 130, h: 20, color: PLAT2 },
      { x: 630, y: 230, w: 130, h: 20, color: PLAT2 },
    ],
    movingPlatforms: [
      { x: 200, y: 370, w: 110, h: 18, color: PLAT2, moveType: 'horizontal', range: 80,  speed: 80  },
      { x: 420, y: 310, w: 110, h: 18, color: PLAT,  moveType: 'horizontal', range: 90,  speed: 90  },
      { x: 200, y: 220, w: 110, h: 18, color: PLAT2, moveType: 'horizontal', range: 100, speed: 100 },
      { x: 430, y: 160, w: 110, h: 18, color: PLAT,  moveType: 'horizontal', range: 80,  speed: 110 },
    ],
    collectibles: [
      { x: 90,  y: 360 }, { x: 680, y: 360 },
      { x: 255, y: 340 }, { x: 475, y: 280 },
      { x: 90,  y: 200 }, { x: 680, y: 200 },
      { x: 485, y: 130 },
    ],
    spawnPool: [
      { x: 450, y: GAME_HEIGHT - 80, range: 120 },
      { x: 650, y: GAME_HEIGHT - 80, range: 80  },
      { x: 680, y: 203,              range: 60  },
      { x: 90,  y: 203,              range: 60  },
      { x: 680, y: 363,              range: 50  },
      { x: 650, y: 363,              range: 50,  type: 'hammer' },
      { x: 400, y: GAME_HEIGHT - 80, range: 80,  type: 'hammer' },
    ],
    spawnCount: 4,
  },

  // --- Bölüm 5 ---
  {
    playerStart: { x: 60, y: GAME_HEIGHT - 100 },
    platforms: [
      { x: 0,   y: GAME_HEIGHT - 32, w: 160, h: 32, color: GROUND },
      { x: 640, y: GAME_HEIGHT - 32, w: 160, h: 32, color: GROUND },
      { x: 340, y: GAME_HEIGHT - 32, w: 120, h: 32, color: GROUND },
      { x: 330, y: 130,              w: 140, h: 20, color: PLAT2  },
    ],
    movingPlatforms: [
      { x: 170, y: 390, w: 100, h: 18, color: PLAT,  moveType: 'horizontal', range: 70,  speed: 90  },
      { x: 510, y: 390, w: 100, h: 18, color: PLAT2, moveType: 'horizontal', range: 70,  speed: 90  },
      { x: 280, y: 290, w: 100, h: 18, color: PLAT,  moveType: 'horizontal', range: 110, speed: 110 },
      { x: 460, y: 210, w: 100, h: 18, color: PLAT2, moveType: 'horizontal', range: 100, speed: 120 },
      { x: 100, y: 250, w: 100, h: 18, color: PLAT2, moveType: 'vertical',   range: 80,  speed: 80  },
      { x: 600, y: 250, w: 100, h: 18, color: PLAT,  moveType: 'vertical',   range: 80,  speed: 80  },
      { x: 220, y: 150, w: 100, h: 18, color: PLAT,  moveType: 'vertical',   range: 50,  speed: 100 },
    ],
    collectibles: [
      { x: 400, y: GAME_HEIGHT - 70 },
      { x: 220, y: 360 }, { x: 560, y: 360 },
      { x: 335, y: 260 }, { x: 150, y: 220 },
      { x: 650, y: 220 }, { x: 515, y: 180 },
      { x: 270, y: 120 }, { x: 400, y: 100 },
    ],
    spawnPool: [
      { x: 700, y: GAME_HEIGHT - 80, range: 70  },
      { x: 400, y: GAME_HEIGHT - 80, range: 50  },
      { x: 335, y: 260,              range: 80  },
      { x: 400, y: 103,              range: 60  },
      { x: 650, y: GAME_HEIGHT - 80, range: 60  },
      { x: 100, y: GAME_HEIGHT - 80, range: 50,  type: 'heavy'  },
      { x: 720, y: GAME_HEIGHT - 80, range: 50,  type: 'heavy'  },
      { x: 700, y: GAME_HEIGHT - 80, range: 60,  type: 'hammer' },
    ],
    spawnCount: 5,
  },

  // --- Bölüm 6 ---
  {
    playerStart: { x: 60, y: GAME_HEIGHT - 100 },
    platforms: [
      { x: 0,   y: GAME_HEIGHT - 32, w: 100, h: 32, color: GROUND },
      { x: 700, y: GAME_HEIGHT - 32, w: 100, h: 32, color: GROUND },
      { x: 350, y: 100,              w: 100, h: 20, color: PLAT2  },
    ],
    movingPlatforms: [
      { x: 110, y: 400, w: 90, h: 18, color: PLAT,  moveType: 'horizontal', range: 100, speed: 110 },
      { x: 380, y: 400, w: 90, h: 18, color: PLAT2, moveType: 'horizontal', range: 100, speed: 130 },
      { x: 580, y: 380, w: 90, h: 18, color: PLAT,  moveType: 'vertical',   range: 60,  speed: 100 },
      { x: 80,  y: 310, w: 90, h: 18, color: PLAT2, moveType: 'vertical',   range: 70,  speed: 110 },
      { x: 260, y: 300, w: 90, h: 18, color: PLAT,  moveType: 'horizontal', range: 90,  speed: 130 },
      { x: 480, y: 290, w: 90, h: 18, color: PLAT2, moveType: 'horizontal', range: 90,  speed: 140 },
      { x: 640, y: 280, w: 90, h: 18, color: PLAT,  moveType: 'vertical',   range: 80,  speed: 120 },
      { x: 150, y: 200, w: 90, h: 18, color: PLAT,  moveType: 'horizontal', range: 100, speed: 150 },
      { x: 400, y: 190, w: 90, h: 18, color: PLAT2, moveType: 'vertical',   range: 60,  speed: 140 },
      { x: 580, y: 180, w: 90, h: 18, color: PLAT,  moveType: 'horizontal', range: 80,  speed: 160 },
    ],
    collectibles: [
      { x: 50,  y: GAME_HEIGHT - 70 }, { x: 740, y: GAME_HEIGHT - 70 },
      { x: 155, y: 370 }, { x: 425, y: 370 },
      { x: 135, y: 280 }, { x: 310, y: 270 },
      { x: 530, y: 260 }, { x: 200, y: 170 },
      { x: 450, y: 160 }, { x: 400, y: 70  },
    ],
    spawnPool: [
      { x: 50,  y: GAME_HEIGHT - 80, range: 30 },
      { x: 730, y: GAME_HEIGHT - 80, range: 30 },
      { x: 400, y: 73,               range: 30 },
      { x: 750, y: GAME_HEIGHT - 80, range: 25,  type: 'heavy'  },
      { x: 730, y: GAME_HEIGHT - 80, range: 25,  type: 'hammer' },
      { x: 400, y: 73,               range: 25,  type: 'hammer' },
      { x: 730, y: GAME_HEIGHT - 80, range: 30,  type: 'heavy'  },
    ],
    spawnCount: 4,
  },
];
