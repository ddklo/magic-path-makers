// Generates all game textures programmatically — no external assets needed.
export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  create() {
    this._genPixel();
    this._genCharacter();
    this._genRock();
    this._genStar();
    this._genPortal();
    this.scene.start('MenuScene');
  }

  // 4×4 white pixel — used for particles and static-body sprites.
  _genPixel() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xFFFFFF);
    g.fillRect(0, 0, 4, 4);
    g.generateTexture('pixel', 4, 4);
    g.destroy();
  }

  // Orange blob with eyes.
  _genCharacter() {
    const g = this.make.graphics({ add: false });
    // Body shadow.
    g.fillStyle(0xCC6600, 0.4);
    g.fillEllipse(19, 22, 28, 12);
    // Body.
    g.fillStyle(0xFF8C00);
    g.fillEllipse(17, 18, 30, 34);
    // Eyes.
    g.fillStyle(0xFFFFFF);
    g.fillCircle(11, 14, 5);
    g.fillCircle(23, 14, 5);
    g.fillStyle(0x111111);
    g.fillCircle(12, 14, 3);
    g.fillCircle(24, 14, 3);
    // Tiny highlight dots.
    g.fillStyle(0xFFFFFF);
    g.fillCircle(11, 13, 1);
    g.fillCircle(23, 13, 1);
    g.generateTexture('character', 36, 40);
    g.destroy();
  }

  // Gray stone.
  _genRock() {
    const g = this.make.graphics({ add: false });
    // Main rock body.
    g.fillStyle(0x777777);
    g.fillRoundedRect(3, 8, 36, 34, 8);
    // Highlight.
    g.fillStyle(0xAAAAAA);
    g.fillRoundedRect(6, 10, 18, 10, 4);
    // Dark crack.
    g.lineStyle(1.5, 0x444444, 0.8);
    g.lineBetween(22, 14, 28, 30);
    g.generateTexture('rock', 42, 52);
    g.destroy();
  }

  // 5-pointed star.
  _genStar() {
    const g   = this.make.graphics({ add: false });
    const cx  = 13, cy = 13;
    const outerR = 12, innerR = 5;
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI / 5) - Math.PI / 2;
      const r     = i % 2 === 0 ? outerR : innerR;
      pts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
    // Glow.
    g.fillStyle(0xFFFF88, 0.4);
    g.fillCircle(cx, cy, 14);
    // Star fill.
    g.fillStyle(0xFFDD00);
    g.fillPoints(pts, true);
    // Bright inner star.
    const innerPts = pts.map((p, i) => {
      const angle = (i * Math.PI / 5) - Math.PI / 2;
      const r     = i % 2 === 0 ? outerR * 0.5 : innerR * 0.5;
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });
    g.fillStyle(0xFFFF88, 0.6);
    g.fillPoints(innerPts, true);
    g.generateTexture('star', 26, 26);
    g.destroy();
  }

  // Glowing oval portal.
  _genPortal() {
    const g = this.make.graphics({ add: false });
    // Outer glow.
    g.fillStyle(0x6A0DAD, 0.35);
    g.fillEllipse(24, 40, 48, 80);
    // Main body.
    g.fillStyle(0x9C27B0, 0.85);
    g.fillEllipse(24, 40, 40, 66);
    // Inner swirl.
    g.fillStyle(0xCE93D8, 0.9);
    g.fillEllipse(24, 40, 28, 46);
    // Core.
    g.fillStyle(0xF3E5F5, 0.95);
    g.fillEllipse(24, 40, 16, 28);
    // Bright centre flash.
    g.fillStyle(0xFFFFFF, 0.6);
    g.fillEllipse(24, 36, 8, 12);
    g.generateTexture('portal', 48, 80);
    g.destroy();
  }
}
