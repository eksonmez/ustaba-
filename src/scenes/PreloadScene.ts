import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // İleride buraya asset yüklemeleri gelecek
  }

  create() {
    this.scene.start('MenuScene');
  }
}
