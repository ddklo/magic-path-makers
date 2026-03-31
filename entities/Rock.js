export class Rock {
  constructor(scene, x, y, group) {
    this.scene   = scene;
    this.broken  = false;

    this.sprite = group.create(x, y, 'rock');
    this.sprite.setDisplaySize(42, 52);
    this.sprite.refreshBody();
    this.sprite.setDepth(15);
    this.sprite.parentRock = this;
  }

  onTap() {
    if (this.broken) return;
    this.broken = true;

    // Puff of rock particles.
    const emitter = this.scene.add.particles(this.sprite.x, this.sprite.y, 'pixel', {
      speed:     { min: 60,  max: 160 },
      angle:     { min: 0,   max: 360 },
      scale:     { start: 0.7, end: 0 },
      lifespan:  550,
      quantity:  16,
      tint:      [0x888888, 0x666666, 0xAAAAAA, 0x555555],
      stopAfter: 16,
    });
    this.scene.time.delayedCall(900, () => emitter.destroy());

    // Squish-and-vanish tween.
    this.scene.tweens.add({
      targets:  this.sprite,
      scaleY:   0,
      scaleX:   1.6,
      y:        this.sprite.y + 10,
      duration: 220,
      ease:     'Power2',
      onComplete: () => this.sprite.destroy(),
    });
  }
}
