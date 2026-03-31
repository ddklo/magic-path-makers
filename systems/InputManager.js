import { TAP_MAX_MOVE, TAP_MAX_DURATION } from '../utils/constants.js';

// Wraps Phaser pointer events into semantic tap / drag events.
// Extends Phaser.Events.EventEmitter (Phaser is a CDN global).
export class InputManager extends Phaser.Events.EventEmitter {
  constructor(scene) {
    super();
    this.scene    = scene;
    this._down    = null;   // { worldX, worldY, time, moved }

    scene.input.on('pointerdown', this._onDown, this);
    scene.input.on('pointermove', this._onMove, this);
    scene.input.on('pointerup',   this._onUp,   this);
  }

  _onDown(pointer) {
    this._down = {
      worldX: pointer.worldX,
      worldY: pointer.worldY,
      time:   pointer.downTime,
      moved:  0,
    };
    this.emit('drag-start', { worldX: pointer.worldX, worldY: pointer.worldY });
  }

  _onMove(pointer) {
    if (!pointer.isDown || !this._down) return;
    const dx     = pointer.worldX - this._down.worldX;
    const dy     = pointer.worldY - this._down.worldY;
    this._down.moved = Math.sqrt(dx * dx + dy * dy);
    this.emit('drag-move', { worldX: pointer.worldX, worldY: pointer.worldY });
  }

  _onUp(pointer) {
    if (!this._down) return;
    const duration = pointer.upTime - this._down.time;
    const isTap    = this._down.moved < TAP_MAX_MOVE && duration < TAP_MAX_DURATION;

    if (isTap) {
      this.emit('tap', { worldX: this._down.worldX, worldY: this._down.worldY });
    } else {
      this.emit('drag-end', { worldX: pointer.worldX, worldY: pointer.worldY });
    }
    this._down = null;
  }

  destroy() {
    this.scene.input.off('pointerdown', this._onDown, this);
    this.scene.input.off('pointermove', this._onMove, this);
    this.scene.input.off('pointerup',   this._onUp,   this);
    super.destroy();
  }
}
