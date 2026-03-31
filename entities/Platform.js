import { PLATFORM_THICKNESS, COLORS, SIMPLIFY_TOLERANCE } from '../utils/constants.js';
import { simplifyPolyline, segmentAABB } from '../utils/geometry.js';

export class Platform {
  constructor(scene, rawPoints, platformGroup) {
    this.scene   = scene;
    this.bodies  = [];
    this.graphics = scene.add.graphics();
    this.graphics.setDepth(10);

    const points = simplifyPolyline(rawPoints, SIMPLIFY_TOLERANCE);

    // Visual — glow pass then solid line.
    this.graphics.lineStyle(14, COLORS.platformGlow, 0.25);
    this._drawPath(points);

    this.graphics.lineStyle(6, COLORS.platformPlaced, 1);
    this._drawPath(points);

    // End-cap dots.
    this.graphics.fillStyle(COLORS.platformPlaced, 1);
    this.graphics.fillCircle(points[0].x,                   points[0].y,                   5);
    this.graphics.fillCircle(points[points.length - 1].x,   points[points.length - 1].y,   5);

    // Physics bodies — one AABB rect per segment.
    for (let i = 0; i < points.length - 1; i++) {
      const { x, y, width, height } = segmentAABB(points[i], points[i + 1], PLATFORM_THICKNESS);
      const body = platformGroup.create(x, y, 'pixel');
      body.setDisplaySize(width, height);
      body.setVisible(false);
      body.refreshBody();
      this.bodies.push(body);
    }
  }

  _drawPath(points) {
    this.graphics.beginPath();
    points.forEach((p, i) => {
      i === 0 ? this.graphics.moveTo(p.x, p.y) : this.graphics.lineTo(p.x, p.y);
    });
    this.graphics.strokePath();
  }

  // Flash then destroy — used when oldest platform is evicted.
  flashAndDestroy() {
    this.scene.tweens.add({
      targets:  this.graphics,
      alpha:    0,
      duration: 250,
      yoyo:     true,
      repeat:   3,
      onComplete: () => this.destroy(),
    });
  }

  destroy() {
    this.bodies.forEach(b => { if (b.active) b.destroy(); });
    this.graphics.destroy();
  }
}
