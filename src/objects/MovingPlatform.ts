import Phaser from 'phaser';

export type MoveType = 'horizontal' | 'vertical';

export class MovingPlatform extends Phaser.Physics.Arcade.Image {
  private startBound: number;
  private endBound: number;
  private speed: number;
  private moveType: MoveType;

  constructor(
    scene: Phaser.Scene,
    x: number, y: number,
    w: number, h: number,
    color: number,
    moveType: MoveType,
    range: number,
    speed: number
  ) {
    const key = `mplat_${w}_${h}_${color}`;
    if (!scene.textures.exists(key)) {
      const g = scene.add.graphics();
      g.fillStyle(color);
      g.fillRect(0, 0, w, h);
      // Üst kenar aydınlık — hareketli olduğunu belli etsin
      g.fillStyle(0xffffff, 0.25);
      g.fillRect(0, 0, w, 3);
      g.fillStyle(0x000000, 0.2);
      g.fillRect(0, h - 3, w, 3);
      g.generateTexture(key, w, h);
      g.destroy();
    }

    super(scene, x + w / 2, y + h / 2, key);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(true);
    body.setAllowGravity(false);

    this.moveType = moveType;
    this.speed    = speed;

    if (moveType === 'horizontal') {
      this.startBound = x + w / 2 - range;
      this.endBound   = x + w / 2 + range;
      body.setVelocityX(speed);
    } else {
      this.startBound = y + h / 2 - range;
      this.endBound   = y + h / 2 + range;
      body.setVelocityY(speed);
    }
  }

  update() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (this.moveType === 'horizontal') {
      if (this.x >= this.endBound)   body.setVelocityX(-this.speed);
      else if (this.x <= this.startBound) body.setVelocityX(this.speed);
    } else {
      if (this.y >= this.endBound)   body.setVelocityY(-this.speed);
      else if (this.y <= this.startBound) body.setVelocityY(this.speed);
    }
  }
}
