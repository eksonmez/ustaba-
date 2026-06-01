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
}

export const CHARACTERS: CharacterConfig[] = [
  {
    id: 'ustabasi',
    name: 'USTABAŞI',
    title: 'Dengeli Usta',
    description: ['Dengeli istatistikler', 'Standart yetenekler'],
    textureKey: 'char_ustabasi',
    colors: { hat: 0xffd700, hatBrim: 0xe6c000, hatShadow: 0xb89600, overalls: 0xe8620a, ovShade: 0xb04500 },
    speed: 200,
    jumpVelocity: -380,
    dashCooldown: 1000,
    doubleJump: false,
    brickFromStart: false,
  },
  {
    id: 'duvarcı',
    name: 'DUVARCΙ',
    title: 'Güçlü Usta',
    description: ['Yavaş ama yükseğe zıplar', 'Tuğla baştan açık'],
    textureKey: 'char_duvarcı',
    colors: { hat: 0xdd2222, hatBrim: 0xbb1111, hatShadow: 0x881111, overalls: 0x2255cc, ovShade: 0x1133aa },
    speed: 160,
    jumpVelocity: -440,
    dashCooldown: 1000,
    doubleJump: false,
    brickFromStart: true,
  },
  {
    id: 'elektrikci',
    name: 'ELEKTRİKÇİ',
    title: 'Hızlı Usta',
    description: ['Hızlı koşar', 'Dash bekleme süresi yarıya iner'],
    textureKey: 'char_elektrikci',
    colors: { hat: 0xffffff, hatBrim: 0xdddddd, hatShadow: 0xaaaaaa, overalls: 0xddcc00, ovShade: 0xaa9900 },
    speed: 260,
    jumpVelocity: -380,
    dashCooldown: 500,
    doubleJump: false,
    brickFromStart: false,
  },
  {
    id: 'tesisatci',
    name: 'TESİSATÇI',
    title: 'Çift Zıplayan',
    description: ['Çift zıplama yapabilir', 'Platformlara kolayca ulaşır'],
    textureKey: 'char_tesisatci',
    colors: { hat: 0xff8800, hatBrim: 0xdd6600, hatShadow: 0xaa4400, overalls: 0x228833, ovShade: 0x116622 },
    speed: 200,
    jumpVelocity: -380,
    dashCooldown: 1000,
    doubleJump: true,
    brickFromStart: false,
  },
];
