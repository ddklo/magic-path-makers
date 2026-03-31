import { MIN_DRAW_LENGTH, MAX_DRAWN_PLATFORMS, COLORS } from '../utils/constants.js';
import { polylineLength } from '../utils/geometry.js';
import { Platform } from '../entities/Platform.js';

const STATE = { IDLE: 'idle', DRAWING: 'drawing' };

export class DrawingSystem {
  constructor(scene, inputManager, platformGroup) {
    this.scene         = scene;
    this.platformGroup = platformGroup;
    this.state         = STATE.IDLE;
    this.currentPoints = [];
    this.platforms     = [];  // ordered oldest → newest

    this.drawGraphics = scene.add.graphics();
    this.drawGraphics.setDepth(25);

    inputManager.on('drag-start', ({ worldX, worldY }) => {
      this.state         = STATE.DRAWING;
      this.currentPoints = [{ x: worldX, y: worldY }];
    });

    inputManager.on('drag-move', ({ worldX, worldY }) => {
      if (this.state !== STATE.DRAWING) return;
      const last = this.currentPoints[this.currentPoints.length - 1];
      const dx   = worldX - last.x;
      const dy   = worldY - last.y;
      // Only record point if the pointer moved at least 4 px.
      if (dx * dx + dy * dy > 16) {
        this.currentPoints.push({ x: worldX, y: worldY });
      }
    });

    inputManager.on('drag-end', () => {
      if (this.state !== STATE.DRAWING) return;
      this._commit();
      this.state = STATE.IDLE;
    });

    // If pointer leaves the canvas while drawing, commit what we have.
    inputManager.on('tap', () => {
      if (this.state === STATE.DRAWING) {
        this._commit();
        this.state = STATE.IDLE;
      }
    });
  }

  _commit() {
    this.drawGraphics.clear();

    if (this.currentPoints.length < 2 ||
        polylineLength(this.currentPoints) < MIN_DRAW_LENGTH) {
      this.currentPoints = [];
      return;
    }

    // Evict oldest platform if over the cap.
    if (this.platforms.length >= MAX_DRAWN_PLATFORMS) {
      const oldest = this.platforms.shift();
      oldest.flashAndDestroy();
    }

    const platform = new Platform(this.scene, this.currentPoints, this.platformGroup);
    this.platforms.push(platform);
    this.currentPoints = [];
  }

  // Called every frame — redraws the in-progress trail.
  update() {
    if (this.state !== STATE.DRAWING || this.currentPoints.length < 2) return;

    this.drawGraphics.clear();

    // Glow.
    this.drawGraphics.lineStyle(12, COLORS.platformDrawing, 0.28);
    this._stroke(this.currentPoints);

    // Core line.
    this.drawGraphics.lineStyle(4, COLORS.platformDrawing, 1);
    this._stroke(this.currentPoints);

    // Leading dot.
    const tip = this.currentPoints[this.currentPoints.length - 1];
    this.drawGraphics.fillStyle(COLORS.platformDrawing, 1);
    this.drawGraphics.fillCircle(tip.x, tip.y, 5);
  }

  _stroke(points) {
    this.drawGraphics.beginPath();
    points.forEach((p, i) => {
      i === 0
        ? this.drawGraphics.moveTo(p.x, p.y)
        : this.drawGraphics.lineTo(p.x, p.y);
    });
    this.drawGraphics.strokePath();
  }

  destroy() {
    this.drawGraphics.destroy();
    this.platforms.forEach(p => p.destroy());
  }
}
