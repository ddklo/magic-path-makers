import { WALK_SPEED, WORLD_HEIGHT } from '../utils/constants.js';
import { applyCharacterPhysics } from '../systems/PhysicsSetup.js';
import { getEventBus } from '../utils/EventBus.js';

export class Character {
  constructor(scene, x, y) {
    this.scene = scene;
    this.alive = true;

    this.sprite = scene.physics.add.image(x, y, 'character');
    this.sprite.setDisplaySize(36, 40);
    this.sprite.body.setSize(30, 34);
    applyCharacterPhysics(this.sprite);
    this.sprite.setDepth(30);
  }

  update() {
    if (!this.alive) return;

    // Always walk right.
    this.sprite.body.setVelocityX(WALK_SPEED);

    // Lean forward slightly while airborne.
    this.sprite.setAngle(this.sprite.body.blocked.down ? 0 : 5);

    // Fall / death detection.
    if (this.sprite.y > WORLD_HEIGHT + 100) {
      this.respawn();
    }
  }

  respawn() {
    this.sprite.setPosition(this.scene.spawnPoint.x, this.scene.spawnPoint.y);
    this.sprite.body.setVelocity(0, 0);
    this.sprite.setAlpha(1);

    // Flash to signal respawn.
    this.scene.tweens.add({
      targets:  this.sprite,
      alpha:    0,
      duration: 120,
      yoyo:     true,
      repeat:   4,
    });

    getEventBus().emit('player-respawned');
  }
}
