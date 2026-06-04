export interface CharacterColors {
  hat: number;
  hatBrim: number;
  hatShadow: number;
  overalls: number;
  ovShade: number;
}

export interface CharacterConfig {
  id: string;
  name: string;
  title: string;
  description: string[];
  textureKey: string;
  colors: CharacterColors;
  speed: number;
  jumpVelocity: number;
  dashCooldown: number;
  doubleJump: boolean;
  brickFromStart: boolean;
  startingLives?: number;
  wallSlide?: boolean;
  dashStun?: boolean;
  piercingProjectile?: boolean;
}

export const CHARACTERS: CharacterConfig[] = [
  {
    id: 'ustabasi',
    name: 'USTABAŞI',
    title: 'Dengeli Usta',
    description: ['4 can ile başlar', 'Dengeli istatistikler'],
    textureKey: 'char_ustabasi',
    colors: { hat: 0xffd700, hatBrim: 0xe0b800, hatShadow: 0xb08800, overalls: 0xd4500a, ovShade: 0x9e3600 },
    speed: 200,
    jumpVelocity: -380,
    dashCooldown: 1000,
    doubleJump: false,
    brickFromStart: false,
    startingLives: 4,
  },
  {
    id: 'duvarcı',
    name: 'DUVARCΙ',
    title: 'Güçlü Usta',
    description: ['Duvara yavaş kayar', 'Tuğla baştan açık, yükseğe zıplar'],
    textureKey: 'char_duvarcı',
    colors: { hat: 0xcc2222, hatBrim: 0xaa1111, hatShadow: 0x770000, overalls: 0x1a3a99, ovShade: 0x0f2266 },
    speed: 160,
    jumpVelocity: -440,
    dashCooldown: 1000,
    doubleJump: false,
    brickFromStart: true,
    wallSlide: true,
  },
  {
    id: 'elektrikci',
    name: 'ELEKTRİKÇİ',
    title: 'Hızlı Usta',
    description: ['Dash ile düşman çarpar', 'Hızlı & sık dash'],
    textureKey: 'char_elektrikci',
    colors: { hat: 0xf5e642, hatBrim: 0xd4c400, hatShadow: 0xa09200, overalls: 0x444444, ovShade: 0x222222 },
    speed: 260,
    jumpVelocity: -380,
    dashCooldown: 500,
    doubleJump: false,
    brickFromStart: false,
    dashStun: true,
  },
  {
    id: 'tesisatci',
    name: 'TESİSATÇI',
    title: 'Çift Zıplayan',
    description: ['Tuğla deliçi — geçip gider', 'Çift zıplama yapabilir'],
    textureKey: 'char_tesisatci',
    colors: { hat: 0x3399cc, hatBrim: 0x2277aa, hatShadow: 0x115577, overalls: 0x2d7a3a, ovShade: 0x1a5225 },
    speed: 200,
    jumpVelocity: -380,
    dashCooldown: 1000,
    doubleJump: true,
    brickFromStart: false,
    piercingProjectile: true,
  },
];
