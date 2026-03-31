import { getEventBus } from '../utils/EventBus.js';

export class Star {
  constructor(scene, x, y) {
    this.scene     = scene;
    this.collected = false;

    this.sprite = scene.physics.add.image(x, y, 'star');
    this.sprite.setDisplaySize(26, 26);
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.setSize(30, 30);  // slightly larger hitbox
    this.sprite.setDepth(20);
    this.sprite.parentStar = this;

    // Gentle bob.
    scene.tweens.add({
      targets:  this.sprite,
      y:        y - 9,
      duration: 950,
      yoyo:     true,
      repeat:   -1,
      ease:     'Sine.easeInOut',
    });

    // Slow spin.
    scene.tweens.add({
      targets:  this.sprite,
      angle:    360,
      duration: 3200,
      repeat:   -1,
    });
  }

  onCollect() {
    if (this.collected) return;
    this.collected = true;

    // Sparkle burst.
    const emitter = this.scene.add.particles(this.sprite.x, this.sprite.y, 'pixel', {
      speed:     { min: 80,  max: 220 },
      angle:     { min: 0,   max: 360 },
      scale:     { start: 0.6, end: 0 },
      lifespan:  600,
      quantity:  18,
      tint:      [0xFFDD00, 0xFFFF00, 0xFFCC00, 0xFFEE44],
      stopAfter: 18,
    });
    this.scene.time.delayedCall(900, () => emitter.destroy());

    getEventBus().emit('star-collected');
    this.sprite.destroy();
  }
}
