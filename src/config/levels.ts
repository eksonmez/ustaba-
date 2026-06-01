export interface PlatformDef { x: number; y: number; w: number; h: number; color: number; }
export interface MovingPlatformDef extends PlatformDef { moveType: 'horizontal' | 'vertical'; range: number; speed: number; }
export interface CollectibleDef { x: number; y: number; }
export type EnemyType = 'runner' | 'heavy' | 'hammer';
export interface EnemyDef { x: number; y: number; range: number; type?: EnemyType; }

export interface LevelTheme {
  skyTop: number;
  skyBottom: number;
  ground: number;
  platform: number;
  platformAlt: number;
  bgTint: number;
}

export interface LevelConfig {
  levelWidth: number;
  levelHeight: number;
  theme: LevelTheme;
  playerStart: { x: number; y: number };
  platforms: PlatformDef[];
  movingPlatforms?: MovingPlatformDef[];
  collectibles: CollectibleDef[];
  spawnPool: EnemyDef[];
  spawnCount: number;
}

// ---------- Tema tanımları ----------

const T1: LevelTheme = { // Toprak & Ahşap
  skyTop: 0x4a7fa5, skyBottom: 0xc8602a,
  ground: 0x6b4226, platform: 0x8b5e3c, platformAlt: 0x9a7050, bgTint: 0x2a1608,
};
const T2: LevelTheme = { // Çelik İskele
  skyTop: 0x1a2a3a, skyBottom: 0x2a4a6a,
  ground: 0x3a4a5a, platform: 0x5a7080, platformAlt: 0x3a5a6a, bgTint: 0x1a2434,
};
const T3: LevelTheme = { // Beton
  skyTop: 0x3a5a4a, skyBottom: 0x7a8a7a,
  ground: 0x5a6a5a, platform: 0x808080, platformAlt: 0x6a6a88, bgTint: 0x383838,
};
const T4: LevelTheme = { // Demir Kiriş
  skyTop: 0x2a1a10, skyBottom: 0x7a3010,
  ground: 0x3a2010, platform: 0xb04020, platformAlt: 0x484040, bgTint: 0x1a0a08,
};
const T5: LevelTheme = { // Elektrik Odası
  skyTop: 0x050505, skyBottom: 0x101008,
  ground: 0x141400, platform: 0x444400, platformAlt: 0x282828, bgTint: 0x080808,
};
const T6: LevelTheme = { // Çatı Katı
  skyTop: 0x1a4a8a, skyBottom: 0x6ab0df,
  ground: 0x2a6a2a, platform: 0x5a8aaa, platformAlt: 0x7aaa7a, bgTint: 0x1a3a6a,
};

export const LEVELS: LevelConfig[] = [
  // ============================
  // BÖLÜM 1 — Zemin Kat (1600×600)
  // Tema: Toprak & Ahşap — giriş bölümü, dengeli
  // ============================
  {
    levelWidth: 1600, levelHeight: 600,
    theme: T1,
    playerStart: { x: 80, y: 530 },
    platforms: [
      { x: 0, y: 570, w: 1600, h: 30, color: T1.ground },
      // Sol bölge
      { x: 160, y: 492, w: 130, h: 18, color: T1.platform },
      { x: 360, y: 420, w: 120, h: 18, color: T1.platformAlt },
      { x: 170, y: 350, w: 130, h: 18, color: T1.platform },
      { x: 400, y: 290, w: 120, h: 18, color: T1.platformAlt },
      { x: 210, y: 225, w: 130, h: 18, color: T1.platform },
      { x: 430, y: 200, w: 110, h: 18, color: T1.platformAlt },
      // Orta-sol
      { x: 590, y: 492, w: 130, h: 18, color: T1.platform },
      { x: 770, y: 415, w: 120, h: 18, color: T1.platformAlt },
      { x: 600, y: 340, w: 130, h: 18, color: T1.platform },
      { x: 840, y: 268, w: 120, h: 18, color: T1.platformAlt },
      { x: 680, y: 200, w: 140, h: 18, color: T1.platform },
      { x: 890, y: 180, w: 130, h: 18, color: T1.platformAlt },
      // Orta-sağ
      { x: 1010, y: 492, w: 130, h: 18, color: T1.platform },
      { x: 1160, y: 420, w: 120, h: 18, color: T1.platformAlt },
      { x: 1020, y: 345, w: 130, h: 18, color: T1.platform },
      { x: 1210, y: 280, w: 120, h: 18, color: T1.platformAlt },
      { x: 1060, y: 215, w: 130, h: 18, color: T1.platform },
      // Sağ bölge
      { x: 1350, y: 492, w: 130, h: 18, color: T1.platform },
      { x: 1490, y: 415, w: 110, h: 18, color: T1.platformAlt },
      { x: 1355, y: 340, w: 130, h: 18, color: T1.platform },
      { x: 1470, y: 268, w: 120, h: 18, color: T1.platformAlt },
      { x: 1360, y: 200, w: 130, h: 18, color: T1.platform },
    ],
    collectibles: [
      { x: 225, y: 460 }, { x: 420, y: 390 }, { x: 235, y: 320 }, { x: 460, y: 260 }, { x: 275, y: 195 },
      { x: 655, y: 462 }, { x: 835, y: 385 }, { x: 665, y: 310 }, { x: 905, y: 238 }, { x: 750, y: 170 },
      { x: 1075, y: 462 }, { x: 1225, y: 390 }, { x: 1085, y: 315 }, { x: 1270, y: 250 }, { x: 1125, y: 185 },
      { x: 1415, y: 462 }, { x: 1545, y: 385 }, { x: 1420, y: 310 }, { x: 1530, y: 238 }, { x: 1425, y: 170 },
    ],
    spawnPool: [
      { x: 450, y: 540, range: 120 }, { x: 750, y: 540, range: 100 }, { x: 1100, y: 540, range: 100 },
      { x: 420, y: 261, range: 80 }, { x: 840, y: 238, range: 70 },
      { x: 1210, y: 250, range: 70 }, { x: 1360, y: 310, range: 80 },
      { x: 680, y: 170, range: 60, type: 'hammer' }, { x: 1060, y: 185, range: 60, type: 'hammer' },
      { x: 1360, y: 170, range: 70, type: 'hammer' },
    ],
    spawnCount: 4,
  },

  // ============================
  // BÖLÜM 2 — Çelik İskele (1800×700)
  // Tema: Gri çelik — dikey odak
  // ============================
  {
    levelWidth: 1800, levelHeight: 700,
    theme: T2,
    playerStart: { x: 80, y: 630 },
    platforms: [
      { x: 0, y: 670, w: 1800, h: 30, color: T2.ground },
      // Sol
      { x: 150, y: 592, w: 130, h: 18, color: T2.platform },
      { x: 360, y: 515, w: 120, h: 18, color: T2.platformAlt },
      { x: 160, y: 440, w: 130, h: 18, color: T2.platform },
      { x: 390, y: 365, w: 120, h: 18, color: T2.platformAlt },
      { x: 180, y: 295, w: 130, h: 18, color: T2.platform },
      { x: 410, y: 230, w: 120, h: 18, color: T2.platformAlt },
      { x: 220, y: 165, w: 130, h: 18, color: T2.platform },
      // Orta-sol
      { x: 590, y: 592, w: 130, h: 18, color: T2.platformAlt },
      { x: 760, y: 515, w: 120, h: 18, color: T2.platform },
      { x: 600, y: 440, w: 130, h: 18, color: T2.platformAlt },
      { x: 800, y: 365, w: 120, h: 18, color: T2.platform },
      { x: 620, y: 290, w: 140, h: 18, color: T2.platformAlt },
      { x: 820, y: 220, w: 130, h: 18, color: T2.platform },
      { x: 640, y: 155, w: 130, h: 18, color: T2.platformAlt },
      // Orta-sağ
      { x: 1000, y: 592, w: 130, h: 18, color: T2.platform },
      { x: 1170, y: 515, w: 120, h: 18, color: T2.platformAlt },
      { x: 1010, y: 440, w: 130, h: 18, color: T2.platform },
      { x: 1200, y: 365, w: 120, h: 18, color: T2.platformAlt },
      { x: 1030, y: 290, w: 140, h: 18, color: T2.platform },
      { x: 1220, y: 220, w: 130, h: 18, color: T2.platformAlt },
      // Sağ
      { x: 1400, y: 592, w: 130, h: 18, color: T2.platform },
      { x: 1570, y: 515, w: 120, h: 18, color: T2.platformAlt },
      { x: 1420, y: 440, w: 130, h: 18, color: T2.platform },
      { x: 1600, y: 365, w: 120, h: 18, color: T2.platformAlt },
      { x: 1440, y: 290, w: 130, h: 18, color: T2.platform },
      { x: 1620, y: 225, w: 120, h: 18, color: T2.platformAlt },
      { x: 1460, y: 160, w: 130, h: 18, color: T2.platform },
    ],
    movingPlatforms: [
      { x: 500, y: 440, w: 80, h: 18, color: T2.platformAlt, moveType: 'horizontal', range: 70, speed: 80 },
      { x: 900, y: 365, w: 80, h: 18, color: T2.platform, moveType: 'horizontal', range: 80, speed: 90 },
      { x: 1300, y: 290, w: 80, h: 18, color: T2.platformAlt, moveType: 'horizontal', range: 90, speed: 95 },
    ],
    collectibles: [
      { x: 215, y: 560 }, { x: 420, y: 485 }, { x: 225, y: 410 }, { x: 450, y: 335 }, { x: 245, y: 265 }, { x: 470, y: 200 }, { x: 285, y: 135 },
      { x: 655, y: 560 }, { x: 825, y: 485 }, { x: 665, y: 410 }, { x: 865, y: 335 }, { x: 690, y: 260 }, { x: 885, y: 190 }, { x: 705, y: 125 },
      { x: 1065, y: 560 }, { x: 1235, y: 485 }, { x: 1075, y: 410 }, { x: 1265, y: 335 }, { x: 1100, y: 260 }, { x: 1285, y: 190 },
      { x: 1465, y: 560 }, { x: 1635, y: 485 }, { x: 1485, y: 410 }, { x: 1665, y: 335 }, { x: 1505, y: 260 }, { x: 1525, y: 130 },
    ],
    spawnPool: [
      { x: 500, y: 640, range: 120 }, { x: 900, y: 640, range: 100 }, { x: 1300, y: 640, range: 100 }, { x: 1600, y: 640, range: 80 },
      { x: 390, y: 335, range: 80 }, { x: 800, y: 335, range: 70 }, { x: 1200, y: 335, range: 70 },
      { x: 820, y: 190, range: 70, type: 'hammer' }, { x: 1220, y: 190, range: 70, type: 'hammer' },
      { x: 1600, y: 335, range: 70, type: 'hammer' }, { x: 1460, y: 130, range: 60, type: 'hammer' },
    ],
    spawnCount: 5,
  },

  // ============================
  // BÖLÜM 3 — Beton Kat (2000×700)
  // Tema: Beton gri — grid düzen
  // ============================
  {
    levelWidth: 2000, levelHeight: 700,
    theme: T3,
    playerStart: { x: 80, y: 630 },
    platforms: [
      { x: 0, y: 670, w: 2000, h: 30, color: T3.ground },
      // Sütun 1
      { x: 140, y: 590, w: 140, h: 18, color: T3.platform },
      { x: 140, y: 510, w: 140, h: 18, color: T3.platformAlt },
      { x: 140, y: 430, w: 140, h: 18, color: T3.platform },
      { x: 140, y: 350, w: 140, h: 18, color: T3.platformAlt },
      { x: 140, y: 270, w: 140, h: 18, color: T3.platform },
      { x: 140, y: 190, w: 140, h: 18, color: T3.platformAlt },
      // Sütun 2
      { x: 400, y: 550, w: 140, h: 18, color: T3.platformAlt },
      { x: 400, y: 470, w: 140, h: 18, color: T3.platform },
      { x: 400, y: 390, w: 140, h: 18, color: T3.platformAlt },
      { x: 400, y: 310, w: 140, h: 18, color: T3.platform },
      { x: 400, y: 230, w: 140, h: 18, color: T3.platformAlt },
      // Sütun 3
      { x: 660, y: 590, w: 140, h: 18, color: T3.platform },
      { x: 660, y: 510, w: 140, h: 18, color: T3.platformAlt },
      { x: 660, y: 430, w: 140, h: 18, color: T3.platform },
      { x: 660, y: 350, w: 140, h: 18, color: T3.platformAlt },
      { x: 660, y: 270, w: 140, h: 18, color: T3.platform },
      { x: 660, y: 190, w: 140, h: 18, color: T3.platformAlt },
      // Sütun 4
      { x: 920, y: 550, w: 140, h: 18, color: T3.platformAlt },
      { x: 920, y: 470, w: 140, h: 18, color: T3.platform },
      { x: 920, y: 390, w: 140, h: 18, color: T3.platformAlt },
      { x: 920, y: 310, w: 140, h: 18, color: T3.platform },
      { x: 920, y: 230, w: 140, h: 18, color: T3.platformAlt },
      // Sütun 5
      { x: 1180, y: 590, w: 140, h: 18, color: T3.platform },
      { x: 1180, y: 510, w: 140, h: 18, color: T3.platformAlt },
      { x: 1180, y: 430, w: 140, h: 18, color: T3.platform },
      { x: 1180, y: 350, w: 140, h: 18, color: T3.platformAlt },
      { x: 1180, y: 270, w: 140, h: 18, color: T3.platform },
      { x: 1180, y: 190, w: 140, h: 18, color: T3.platformAlt },
      // Sütun 6
      { x: 1440, y: 550, w: 140, h: 18, color: T3.platformAlt },
      { x: 1440, y: 470, w: 140, h: 18, color: T3.platform },
      { x: 1440, y: 390, w: 140, h: 18, color: T3.platformAlt },
      { x: 1440, y: 310, w: 140, h: 18, color: T3.platform },
      { x: 1440, y: 230, w: 140, h: 18, color: T3.platformAlt },
      // Sütun 7
      { x: 1700, y: 590, w: 140, h: 18, color: T3.platform },
      { x: 1700, y: 510, w: 140, h: 18, color: T3.platformAlt },
      { x: 1700, y: 430, w: 140, h: 18, color: T3.platform },
      { x: 1700, y: 350, w: 140, h: 18, color: T3.platformAlt },
      { x: 1700, y: 270, w: 140, h: 18, color: T3.platform },
      { x: 1700, y: 190, w: 140, h: 18, color: T3.platformAlt },
    ],
    movingPlatforms: [
      { x: 290, y: 470, w: 100, h: 18, color: T3.platform, moveType: 'horizontal', range: 90, speed: 85 },
      { x: 550, y: 390, w: 100, h: 18, color: T3.platformAlt, moveType: 'horizontal', range: 80, speed: 90 },
      { x: 810, y: 470, w: 100, h: 18, color: T3.platform, moveType: 'horizontal', range: 90, speed: 95 },
      { x: 1070, y: 390, w: 100, h: 18, color: T3.platformAlt, moveType: 'horizontal', range: 80, speed: 100 },
      { x: 1330, y: 470, w: 100, h: 18, color: T3.platform, moveType: 'horizontal', range: 90, speed: 100 },
      { x: 1590, y: 390, w: 100, h: 18, color: T3.platformAlt, moveType: 'horizontal', range: 80, speed: 105 },
    ],
    collectibles: [
      { x: 210, y: 560 }, { x: 210, y: 480 }, { x: 210, y: 400 }, { x: 210, y: 320 }, { x: 210, y: 240 }, { x: 210, y: 160 },
      { x: 470, y: 520 }, { x: 470, y: 440 }, { x: 470, y: 360 }, { x: 470, y: 280 }, { x: 470, y: 200 },
      { x: 730, y: 560 }, { x: 730, y: 480 }, { x: 730, y: 400 }, { x: 730, y: 320 }, { x: 730, y: 240 }, { x: 730, y: 160 },
      { x: 990, y: 520 }, { x: 990, y: 440 }, { x: 990, y: 360 }, { x: 990, y: 280 }, { x: 990, y: 200 },
      { x: 1250, y: 560 }, { x: 1250, y: 480 }, { x: 1250, y: 400 }, { x: 1250, y: 320 }, { x: 1250, y: 240 }, { x: 1250, y: 160 },
      { x: 1510, y: 520 }, { x: 1510, y: 440 }, { x: 1510, y: 360 }, { x: 1510, y: 280 }, { x: 1510, y: 200 },
      { x: 1770, y: 560 }, { x: 1770, y: 480 }, { x: 1770, y: 400 }, { x: 1770, y: 320 }, { x: 1770, y: 240 }, { x: 1770, y: 160 },
    ],
    spawnPool: [
      { x: 400, y: 640, range: 100 }, { x: 800, y: 640, range: 100 }, { x: 1200, y: 640, range: 100 }, { x: 1600, y: 640, range: 100 },
      { x: 210, y: 320, range: 80 }, { x: 730, y: 320, range: 80 }, { x: 1250, y: 320, range: 80 }, { x: 1770, y: 320, range: 80 },
      { x: 470, y: 280, range: 80, type: 'hammer' }, { x: 990, y: 280, range: 80, type: 'hammer' }, { x: 1510, y: 280, range: 80, type: 'hammer' },
      { x: 210, y: 160, range: 60, type: 'hammer' }, { x: 730, y: 160, range: 60, type: 'hammer' }, { x: 1770, y: 160, range: 60, type: 'hammer' },
    ],
    spawnCount: 6,
  },

  // ============================
  // BÖLÜM 4 — Demir Kiriş (2000×800)
  // Tema: Pas & Demir — hareketli platform ağırlıklı
  // ============================
  {
    levelWidth: 2000, levelHeight: 800,
    theme: T4,
    playerStart: { x: 80, y: 740 },
    platforms: [
      // Dağınık zemin segmentleri
      { x: 0,    y: 770, w: 200, h: 30, color: T4.ground },
      { x: 380,  y: 770, w: 180, h: 30, color: T4.ground },
      { x: 740,  y: 770, w: 180, h: 30, color: T4.ground },
      { x: 1100, y: 770, w: 180, h: 30, color: T4.ground },
      { x: 1460, y: 770, w: 180, h: 30, color: T4.ground },
      { x: 1800, y: 770, w: 200, h: 30, color: T4.ground },
      // Statik kiriş platformları
      { x: 60,   y: 660, w: 140, h: 18, color: T4.platform },
      { x: 350,  y: 600, w: 130, h: 18, color: T4.platformAlt },
      { x: 60,   y: 530, w: 140, h: 18, color: T4.platform },
      { x: 340,  y: 460, w: 130, h: 18, color: T4.platformAlt },
      { x: 80,   y: 390, w: 140, h: 18, color: T4.platform },
      { x: 360,  y: 325, w: 130, h: 18, color: T4.platformAlt },
      { x: 100,  y: 265, w: 140, h: 18, color: T4.platform },
      { x: 380,  y: 210, w: 130, h: 18, color: T4.platformAlt },
      { x: 120,  y: 160, w: 140, h: 18, color: T4.platform },
      // Sağ taraf statik
      { x: 1750, y: 660, w: 140, h: 18, color: T4.platform },
      { x: 1600, y: 580, w: 130, h: 18, color: T4.platformAlt },
      { x: 1750, y: 500, w: 140, h: 18, color: T4.platform },
      { x: 1600, y: 420, w: 130, h: 18, color: T4.platformAlt },
      { x: 1760, y: 340, w: 140, h: 18, color: T4.platform },
      { x: 1600, y: 260, w: 130, h: 18, color: T4.platformAlt },
      { x: 1770, y: 190, w: 140, h: 18, color: T4.platform },
    ],
    movingPlatforms: [
      // Yatay hareketliler — orta bölge
      { x: 550,  y: 680, w: 120, h: 18, color: T4.platform,    moveType: 'horizontal', range: 120, speed: 90  },
      { x: 800,  y: 600, w: 120, h: 18, color: T4.platformAlt, moveType: 'horizontal', range: 130, speed: 100 },
      { x: 600,  y: 520, w: 110, h: 18, color: T4.platform,    moveType: 'horizontal', range: 110, speed: 110 },
      { x: 850,  y: 440, w: 110, h: 18, color: T4.platformAlt, moveType: 'horizontal', range: 120, speed: 115 },
      { x: 620,  y: 360, w: 110, h: 18, color: T4.platform,    moveType: 'horizontal', range: 100, speed: 120 },
      { x: 860,  y: 280, w: 110, h: 18, color: T4.platformAlt, moveType: 'horizontal', range: 110, speed: 125 },
      { x: 640,  y: 205, w: 110, h: 18, color: T4.platform,    moveType: 'horizontal', range: 100, speed: 130 },
      // Dikey hareketliler
      { x: 1100, y: 650, w: 110, h: 18, color: T4.platformAlt, moveType: 'vertical', range: 80,  speed: 90  },
      { x: 1300, y: 560, w: 110, h: 18, color: T4.platform,    moveType: 'vertical', range: 90,  speed: 100 },
      { x: 1100, y: 450, w: 110, h: 18, color: T4.platformAlt, moveType: 'vertical', range: 80,  speed: 105 },
      { x: 1300, y: 370, w: 110, h: 18, color: T4.platform,    moveType: 'vertical', range: 90,  speed: 110 },
      { x: 1100, y: 290, w: 110, h: 18, color: T4.platformAlt, moveType: 'vertical', range: 80,  speed: 115 },
      { x: 1300, y: 210, w: 110, h: 18, color: T4.platform,    moveType: 'vertical', range: 70,  speed: 120 },
    ],
    collectibles: [
      { x: 130, y: 630 }, { x: 415, y: 570 }, { x: 130, y: 500 }, { x: 405, y: 430 },
      { x: 150, y: 360 }, { x: 425, y: 295 }, { x: 170, y: 235 }, { x: 445, y: 180 }, { x: 190, y: 130 },
      { x: 610, y: 650 }, { x: 865, y: 570 }, { x: 670, y: 490 }, { x: 915, y: 410 },
      { x: 690, y: 330 }, { x: 925, y: 250 }, { x: 705, y: 175 },
      { x: 1155, y: 620 }, { x: 1355, y: 530 }, { x: 1155, y: 420 }, { x: 1355, y: 340 },
      { x: 1155, y: 260 }, { x: 1355, y: 180 },
      { x: 1815, y: 630 }, { x: 1665, y: 550 }, { x: 1815, y: 470 }, { x: 1665, y: 390 },
      { x: 1825, y: 310 }, { x: 1665, y: 230 }, { x: 1835, y: 160 },
    ],
    spawnPool: [
      { x: 500, y: 740, range: 80 }, { x: 900, y: 740, range: 80 }, { x: 1250, y: 740, range: 80 }, { x: 1650, y: 740, range: 80 },
      { x: 350, y: 575, range: 80 }, { x: 340, y: 430, range: 70 }, { x: 360, y: 295, range: 70 },
      { x: 1760, y: 500, range: 80, type: 'heavy' }, { x: 1770, y: 340, range: 80, type: 'heavy' },
      { x: 860, y: 250, range: 70, type: 'hammer' }, { x: 640, y: 175, range: 60, type: 'hammer' },
      { x: 1600, y: 420, range: 70, type: 'hammer' }, { x: 1600, y: 260, range: 70, type: 'hammer' },
    ],
    spawnCount: 5,
  },

  // ============================
  // BÖLÜM 5 — Elektrik Odası (2200×800)
  // Tema: Sarı & Siyah — hız odaklı, hareketli ağırlıklı
  // ============================
  {
    levelWidth: 2200, levelHeight: 800,
    theme: T5,
    playerStart: { x: 80, y: 740 },
    platforms: [
      // Zemin parçaları
      { x: 0,    y: 770, w: 160, h: 30, color: T5.ground },
      { x: 340,  y: 770, w: 120, h: 30, color: T5.ground },
      { x: 700,  y: 770, w: 120, h: 30, color: T5.ground },
      { x: 1060, y: 770, w: 120, h: 30, color: T5.ground },
      { x: 1420, y: 770, w: 120, h: 30, color: T5.ground },
      { x: 1780, y: 770, w: 120, h: 30, color: T5.ground },
      { x: 2080, y: 770, w: 120, h: 30, color: T5.ground },
      // Sol statik
      { x: 60,   y: 680, w: 130, h: 18, color: T5.platform },
      { x: 60,   y: 580, w: 130, h: 18, color: T5.platformAlt },
      { x: 60,   y: 480, w: 130, h: 18, color: T5.platform },
      { x: 60,   y: 380, w: 130, h: 18, color: T5.platformAlt },
      { x: 60,   y: 280, w: 130, h: 18, color: T5.platform },
      { x: 60,   y: 185, w: 130, h: 18, color: T5.platformAlt },
      // Sağ statik
      { x: 2020, y: 680, w: 130, h: 18, color: T5.platform },
      { x: 2020, y: 580, w: 130, h: 18, color: T5.platformAlt },
      { x: 2020, y: 480, w: 130, h: 18, color: T5.platform },
      { x: 2020, y: 380, w: 130, h: 18, color: T5.platformAlt },
      { x: 2020, y: 280, w: 130, h: 18, color: T5.platform },
      { x: 2020, y: 185, w: 130, h: 18, color: T5.platformAlt },
      // Orta yüksek platform
      { x: 1030, y: 160, w: 140, h: 18, color: T5.platform },
    ],
    movingPlatforms: [
      // Birinci sıra (y≈680)
      { x: 230,  y: 690, w: 110, h: 18, color: T5.platform,    moveType: 'horizontal', range: 90,  speed: 110 },
      { x: 500,  y: 690, w: 110, h: 18, color: T5.platformAlt, moveType: 'horizontal', range: 90,  speed: 120 },
      { x: 820,  y: 690, w: 110, h: 18, color: T5.platform,    moveType: 'horizontal', range: 90,  speed: 130 },
      { x: 1160, y: 690, w: 110, h: 18, color: T5.platformAlt, moveType: 'horizontal', range: 90,  speed: 120 },
      { x: 1480, y: 690, w: 110, h: 18, color: T5.platform,    moveType: 'horizontal', range: 90,  speed: 130 },
      { x: 1830, y: 690, w: 110, h: 18, color: T5.platformAlt, moveType: 'horizontal', range: 80,  speed: 115 },
      // İkinci sıra (y≈580)
      { x: 260,  y: 595, w: 100, h: 18, color: T5.platformAlt, moveType: 'horizontal', range: 100, speed: 120 },
      { x: 560,  y: 595, w: 100, h: 18, color: T5.platform,    moveType: 'horizontal', range: 100, speed: 130 },
      { x: 900,  y: 595, w: 100, h: 18, color: T5.platformAlt, moveType: 'horizontal', range: 100, speed: 140 },
      { x: 1240, y: 595, w: 100, h: 18, color: T5.platform,    moveType: 'horizontal', range: 100, speed: 130 },
      { x: 1560, y: 595, w: 100, h: 18, color: T5.platformAlt, moveType: 'horizontal', range: 100, speed: 140 },
      { x: 1870, y: 595, w: 100, h: 18, color: T5.platform,    moveType: 'horizontal', range: 90,  speed: 125 },
      // Dikey hareketliler
      { x: 400,  y: 460, w: 100, h: 18, color: T5.platform,    moveType: 'vertical',   range: 80,  speed: 100 },
      { x: 780,  y: 380, w: 100, h: 18, color: T5.platformAlt, moveType: 'vertical',   range: 90,  speed: 110 },
      { x: 1100, y: 460, w: 100, h: 18, color: T5.platform,    moveType: 'vertical',   range: 80,  speed: 115 },
      { x: 1450, y: 380, w: 100, h: 18, color: T5.platformAlt, moveType: 'vertical',   range: 90,  speed: 120 },
      { x: 1750, y: 460, w: 100, h: 18, color: T5.platform,    moveType: 'vertical',   range: 80,  speed: 125 },
      // Üst sıra
      { x: 600,  y: 270, w: 100, h: 18, color: T5.platformAlt, moveType: 'horizontal', range: 120, speed: 130 },
      { x: 1300, y: 270, w: 100, h: 18, color: T5.platform,    moveType: 'horizontal', range: 120, speed: 140 },
      { x: 900,  y: 200, w: 100, h: 18, color: T5.platformAlt, moveType: 'horizontal', range: 100, speed: 150 },
    ],
    collectibles: [
      { x: 125, y: 650 }, { x: 125, y: 550 }, { x: 125, y: 450 }, { x: 125, y: 350 }, { x: 125, y: 250 }, { x: 125, y: 155 },
      { x: 410, y: 660 }, { x: 570, y: 660 }, { x: 870, y: 660 }, { x: 1210, y: 660 }, { x: 1530, y: 660 }, { x: 1880, y: 660 },
      { x: 310, y: 565 }, { x: 620, y: 565 }, { x: 960, y: 565 }, { x: 1300, y: 565 }, { x: 1620, y: 565 }, { x: 1920, y: 565 },
      { x: 460, y: 430 }, { x: 840, y: 350 }, { x: 1160, y: 430 }, { x: 1510, y: 350 }, { x: 1810, y: 430 },
      { x: 660, y: 240 }, { x: 1100, y: 170 }, { x: 1360, y: 240 }, { x: 960, y: 170 },
      { x: 2085, y: 650 }, { x: 2085, y: 550 }, { x: 2085, y: 450 }, { x: 2085, y: 350 }, { x: 2085, y: 250 }, { x: 2085, y: 155 },
    ],
    spawnPool: [
      { x: 500, y: 740, range: 80 }, { x: 870, y: 740, range: 80 }, { x: 1230, y: 740, range: 80 }, { x: 1590, y: 740, range: 80 }, { x: 1950, y: 740, range: 80 },
      { x: 60, y: 380, range: 70 }, { x: 60, y: 280, range: 70 },
      { x: 2020, y: 380, range: 70 }, { x: 2020, y: 280, range: 70 },
      { x: 500, y: 740, range: 60, type: 'heavy' }, { x: 1590, y: 740, range: 60, type: 'heavy' },
      { x: 780, y: 350, range: 70, type: 'hammer' }, { x: 1450, y: 350, range: 70, type: 'hammer' },
      { x: 1100, y: 130, range: 60, type: 'hammer' },
    ],
    spawnCount: 6,
  },

  // ============================
  // BÖLÜM 6 — Çatı Katı (2400×900)
  // Tema: Gökyüzü mavi — final bölüm, zorlu
  // ============================
  {
    levelWidth: 2400, levelHeight: 900,
    theme: T6,
    playerStart: { x: 80, y: 840 },
    platforms: [
      // Minimal zemin
      { x: 0,    y: 870, w: 160, h: 30, color: T6.ground },
      { x: 400,  y: 870, w: 100, h: 30, color: T6.ground },
      { x: 900,  y: 870, w: 100, h: 30, color: T6.ground },
      { x: 1400, y: 870, w: 100, h: 30, color: T6.ground },
      { x: 1900, y: 870, w: 100, h: 30, color: T6.ground },
      { x: 2260, y: 870, w: 140, h: 30, color: T6.ground },
      // Sol sabit direk
      { x: 60,   y: 775, w: 130, h: 18, color: T6.platform },
      { x: 60,   y: 665, w: 130, h: 18, color: T6.platformAlt },
      { x: 60,   y: 555, w: 130, h: 18, color: T6.platform },
      { x: 60,   y: 445, w: 130, h: 18, color: T6.platformAlt },
      { x: 60,   y: 335, w: 130, h: 18, color: T6.platform },
      { x: 60,   y: 225, w: 130, h: 18, color: T6.platformAlt },
      { x: 60,   y: 135, w: 130, h: 18, color: T6.platform },
      // Sağ sabit direk
      { x: 2210, y: 775, w: 130, h: 18, color: T6.platform },
      { x: 2210, y: 665, w: 130, h: 18, color: T6.platformAlt },
      { x: 2210, y: 555, w: 130, h: 18, color: T6.platform },
      { x: 2210, y: 445, w: 130, h: 18, color: T6.platformAlt },
      { x: 2210, y: 335, w: 130, h: 18, color: T6.platform },
      { x: 2210, y: 225, w: 130, h: 18, color: T6.platformAlt },
      { x: 2210, y: 135, w: 130, h: 18, color: T6.platform },
      // Final platform
      { x: 1130, y: 110, w: 140, h: 18, color: T6.platformAlt },
    ],
    movingPlatforms: [
      // Birinci kat
      { x: 250,  y: 790, w: 110, h: 18, color: T6.platform,    moveType: 'horizontal', range: 120, speed: 120 },
      { x: 560,  y: 790, w: 110, h: 18, color: T6.platformAlt, moveType: 'horizontal', range: 130, speed: 130 },
      { x: 900,  y: 790, w: 110, h: 18, color: T6.platform,    moveType: 'vertical',   range: 80,  speed: 120 },
      { x: 1200, y: 790, w: 110, h: 18, color: T6.platformAlt, moveType: 'horizontal', range: 130, speed: 130 },
      { x: 1560, y: 790, w: 110, h: 18, color: T6.platform,    moveType: 'horizontal', range: 120, speed: 140 },
      { x: 1900, y: 790, w: 110, h: 18, color: T6.platformAlt, moveType: 'vertical',   range: 80,  speed: 130 },
      // İkinci kat
      { x: 260,  y: 675, w: 100, h: 18, color: T6.platformAlt, moveType: 'horizontal', range: 130, speed: 130 },
      { x: 600,  y: 675, w: 100, h: 18, color: T6.platform,    moveType: 'vertical',   range: 90,  speed: 120 },
      { x: 950,  y: 675, w: 100, h: 18, color: T6.platformAlt, moveType: 'horizontal', range: 130, speed: 140 },
      { x: 1300, y: 675, w: 100, h: 18, color: T6.platform,    moveType: 'vertical',   range: 90,  speed: 130 },
      { x: 1600, y: 675, w: 100, h: 18, color: T6.platformAlt, moveType: 'horizontal', range: 120, speed: 145 },
      { x: 1960, y: 675, w: 100, h: 18, color: T6.platform,    moveType: 'horizontal', range: 130, speed: 135 },
      // Üçüncü kat
      { x: 280,  y: 560, w: 100, h: 18, color: T6.platform,    moveType: 'vertical',   range: 80,  speed: 130 },
      { x: 640,  y: 560, w: 100, h: 18, color: T6.platformAlt, moveType: 'horizontal', range: 140, speed: 145 },
      { x: 1000, y: 560, w: 100, h: 18, color: T6.platform,    moveType: 'vertical',   range: 80,  speed: 140 },
      { x: 1350, y: 560, w: 100, h: 18, color: T6.platformAlt, moveType: 'horizontal', range: 130, speed: 150 },
      { x: 1660, y: 560, w: 100, h: 18, color: T6.platform,    moveType: 'vertical',   range: 80,  speed: 145 },
      { x: 2000, y: 560, w: 100, h: 18, color: T6.platformAlt, moveType: 'horizontal', range: 130, speed: 140 },
      // Dördüncü kat
      { x: 450,  y: 445, w: 100, h: 18, color: T6.platformAlt, moveType: 'horizontal', range: 150, speed: 150 },
      { x: 850,  y: 445, w: 100, h: 18, color: T6.platform,    moveType: 'vertical',   range: 90,  speed: 145 },
      { x: 1200, y: 445, w: 100, h: 18, color: T6.platformAlt, moveType: 'horizontal', range: 150, speed: 155 },
      { x: 1600, y: 445, w: 100, h: 18, color: T6.platform,    moveType: 'vertical',   range: 90,  speed: 150 },
      { x: 1950, y: 445, w: 100, h: 18, color: T6.platformAlt, moveType: 'horizontal', range: 140, speed: 155 },
      // Üst katlar
      { x: 500,  y: 335, w: 100, h: 18, color: T6.platform,    moveType: 'horizontal', range: 160, speed: 155 },
      { x: 1000, y: 335, w: 100, h: 18, color: T6.platformAlt, moveType: 'vertical',   range: 100, speed: 150 },
      { x: 1500, y: 335, w: 100, h: 18, color: T6.platform,    moveType: 'horizontal', range: 160, speed: 160 },
      { x: 2000, y: 335, w: 100, h: 18, color: T6.platformAlt, moveType: 'vertical',   range: 100, speed: 155 },
      { x: 700,  y: 230, w: 100, h: 18, color: T6.platformAlt, moveType: 'horizontal', range: 150, speed: 160 },
      { x: 1350, y: 230, w: 100, h: 18, color: T6.platform,    moveType: 'horizontal', range: 150, speed: 165 },
      { x: 1700, y: 230, w: 100, h: 18, color: T6.platformAlt, moveType: 'vertical',   range: 90,  speed: 160 },
      { x: 900,  y: 140, w: 100, h: 18, color: T6.platform,    moveType: 'horizontal', range: 130, speed: 170 },
      { x: 1600, y: 140, w: 100, h: 18, color: T6.platformAlt, moveType: 'horizontal', range: 120, speed: 175 },
    ],
    collectibles: [
      { x: 125, y: 745 }, { x: 125, y: 635 }, { x: 125, y: 525 }, { x: 125, y: 415 }, { x: 125, y: 305 }, { x: 125, y: 195 }, { x: 125, y: 105 },
      { x: 310, y: 760 }, { x: 620, y: 760 }, { x: 960, y: 760 }, { x: 1260, y: 760 }, { x: 1620, y: 760 }, { x: 1960, y: 760 },
      { x: 320, y: 645 }, { x: 660, y: 645 }, { x: 1010, y: 645 }, { x: 1360, y: 645 }, { x: 1660, y: 645 }, { x: 2020, y: 645 },
      { x: 340, y: 530 }, { x: 700, y: 530 }, { x: 1060, y: 530 }, { x: 1410, y: 530 }, { x: 1720, y: 530 }, { x: 2060, y: 530 },
      { x: 510, y: 415 }, { x: 910, y: 415 }, { x: 1260, y: 415 }, { x: 1660, y: 415 }, { x: 2010, y: 415 },
      { x: 560, y: 305 }, { x: 1060, y: 305 }, { x: 1560, y: 305 }, { x: 2060, y: 305 },
      { x: 760, y: 200 }, { x: 1410, y: 200 }, { x: 1760, y: 200 },
      { x: 960, y: 110 }, { x: 1660, y: 110 },
      { x: 1200, y: 80 },
      { x: 2275, y: 745 }, { x: 2275, y: 635 }, { x: 2275, y: 525 }, { x: 2275, y: 415 }, { x: 2275, y: 305 }, { x: 2275, y: 195 }, { x: 2275, y: 105 },
    ],
    spawnPool: [
      { x: 550, y: 840, range: 80 }, { x: 1000, y: 840, range: 80 }, { x: 1450, y: 840, range: 80 }, { x: 1950, y: 840, range: 80 },
      { x: 60,  y: 305, range: 70 }, { x: 60,  y: 195, range: 70 },
      { x: 2210, y: 305, range: 70 }, { x: 2210, y: 195, range: 70 },
      { x: 1000, y: 840, range: 60, type: 'heavy' }, { x: 1450, y: 840, range: 60, type: 'heavy' },
      { x: 60,  y: 840, range: 30, type: 'heavy' }, { x: 2210, y: 840, range: 30, type: 'heavy' },
      { x: 60,  y: 135, range: 60, type: 'hammer' }, { x: 2210, y: 135, range: 60, type: 'hammer' },
      { x: 1200, y: 80, range: 50, type: 'hammer' },
    ],
    spawnCount: 5,
  },
];
