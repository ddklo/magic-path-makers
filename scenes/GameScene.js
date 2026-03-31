import { GAME_WIDTH, GAME_HEIGHT, WORLD_WIDTH, WORLD_HEIGHT, COLORS, GROUND_TOP, GROUND_HEIGHT } from '../utils/constants.js';
import { level1 } from '../levels/level1.js';
import { Character }     from '../entities/Character.js';
import { Rock }          from '../entities/Rock.js';
import { Star }          from '../entities/Star.js';
import { InputManager }  from '../systems/InputManager.js';
import { DrawingSystem } from '../systems/DrawingSystem.js';
import { getEventBus }   from '../utils/EventBus.js';

export class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  create() {
    const level       = level1;
    this.spawnPoint   = { ...level.spawnPoint };
    this.won          = false;

    // Physics world bounds — extend below the visible area so the character
    // can fall before the respawn check triggers.
    this.physics.world.setBounds(0, 0, level.worldWidth, level.worldHeight + 400);

    // ── Background ─────────────────────────────────────────────────────────
    this._createBackground(level);

    // ── Static ground & floating platforms ─────────────────────────────────
    this.groundGroup = this.physics.add.staticGroup();
    this._createGround(level);

    // ── Drawn-platform group (populated by DrawingSystem) ──────────────────
    this.platformGroup = this.physics.add.staticGroup();

    // ── Rocks ──────────────────────────────────────────────────────────────
    this.rockGroup = this.physics.add.staticGroup();
    this.rocks = level.rocks.map(d => new Rock(this, d.x, d.y, this.rockGroup));

    // ── Stars ──────────────────────────────────────────────────────────────
    this.starGroup = this.physics.add.group();
    this.stars = level.stars.map(d => {
      const star = new Star(this, d.x, d.y);
      this.starGroup.add(star.sprite);
      return star;
    });

    // ── Portal ─────────────────────────────────────────────────────────────
    this.portal = this.physics.add.image(level.portalX, level.portalY, 'portal');
    this.portal.setDisplaySize(48, 80);
    this.portal.body.setAllowGravity(false);
    this.portal.body.setSize(42, 64);
    this.portal.setDepth(15);
    this.tweens.add({
      targets:  this.portal,
      scaleY:   1.06,
      scaleX:   0.94,
      duration: 1100,
      yoyo:     true,
      repeat:   -1,
      ease:     'Sine.easeInOut',
    });

    // ── Character ──────────────────────────────────────────────────────────
    this.character = new Character(this, level.spawnPoint.x, level.spawnPoint.y);

    // ── Physics interactions ───────────────────────────────────────────────
    this.physics.add.collider(this.character.sprite, this.groundGroup);
    this.physics.add.collider(this.character.sprite, this.rockGroup);
    this.physics.add.collider(this.character.sprite, this.platformGroup);

    this.physics.add.overlap(
      this.character.sprite,
      this.starGroup,
      (_, starSprite) => { starSprite.parentStar?.onCollect(); }
    );

    this.physics.add.overlap(
      this.character.sprite,
      this.portal,
      () => {
        if (!this.won) {
          this.won = true;
          this.character.alive = false;
          this.character.sprite.body.setVelocity(0, 0);
          // Celebratory bounce.
          this.character.sprite.body.setVelocityY(-350);
          this.time.delayedCall(200, () => getEventBus().emit('player-won'));
        }
      }
    );

    // ── Camera ─────────────────────────────────────────────────────────────
    this.cameras.main.setBounds(0, 0, level.worldWidth, level.worldHeight);
    this.cameras.main.startFollow(this.character.sprite, true, 0.08, 0.08);
    this.cameras.main.fadeIn(400);

    // ── Input & drawing ────────────────────────────────────────────────────
    this.inputManager  = new InputManager(this);
    this.drawingSystem = new DrawingSystem(this, this.inputManager, this.platformGroup);

    // Route taps to rocks.
    this.inputManager.on('tap', ({ worldX, worldY }) => {
      for (const rock of this.rocks) {
        if (rock.broken || !rock.sprite.active) continue;
        const dist = Phaser.Math.Distance.Between(worldX, worldY, rock.sprite.x, rock.sprite.y);
        if (dist < 38) { rock.onTap(); break; }
      }
    });

    // Emit platform count changes to UIScene.
    this.drawingSystem.platforms; // reference held
    this._lastPlatformCount = 0;

    // ── Launch HUD ─────────────────────────────────────────────────────────
    this.scene.launch('UIScene');
  }

  // ── Background ─────────────────────────────────────────────────────────────
  _createBackground(level) {
    const W = level.worldWidth;
    const H = level.worldHeight;

    // Fixed sky.
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x87CEEB)
      .setScrollFactor(0).setDepth(-20);

    // Distant mountains.
    const mtnG = this.add.graphics().setScrollFactor(0.22).setDepth(-18);
    mtnG.fillStyle(0xB0C4DE, 0.55);
    for (let x = 0; x < W + 1000; x += 320) {
      const h = 90 + (x * 7 % 70);
      mtnG.fillTriangle(x, H - 200, x + 160, H - 200 - h, x + 320, H - 200);
    }

    // Back forest.
    const fBackG = this.add.graphics().setScrollFactor(0.42).setDepth(-16);
    fBackG.fillStyle(0x1A5E20, 0.65);
    for (let x = 0; x < W + 600; x += 90) {
      const h = 70 + (x * 3 % 55);
      fBackG.fillTriangle(x, H - 198, x + 45, H - 198 - h, x + 90, H - 198);
    }

    // Front forest — layered conifers.
    const fFrontG = this.add.graphics().setScrollFactor(0.68).setDepth(-14);
    for (let x = 0; x < W + 600; x += 150) {
      const h   = 110 + (x * 5 % 85);
      const off = x * 13 % 28;
      fFrontG.fillStyle(0x4E342E);
      fFrontG.fillRect(x + 52 + off, H - 206, 16, 46);
      fFrontG.fillStyle(0x388E3C);
      fFrontG.fillTriangle(x + off, H - 192, x + 60 + off, H - 192 - h, x + 120 + off, H - 192);
      fFrontG.fillStyle(0x2E7D32);
      fFrontG.fillTriangle(x + 14 + off, H - 212, x + 60 + off, H - 212 - h * 0.73, x + 106 + off, H - 212);
      fFrontG.fillStyle(0x43A047);
      fFrontG.fillTriangle(x + 28 + off, H - 228, x + 60 + off, H - 228 - h * 0.48, x + 92 + off, H - 228);
    }
  }

  // ── Ground + static platforms ───────────────────────────────────────────────
  _createGround(level) {
    const gY = GROUND_TOP;
    const gH = GROUND_HEIGHT;

    level.groundSections.forEach(s => {
      const cx = s.x + s.width / 2;
      const cy = gY + gH / 2;
      // Visual.
      this.add.rectangle(cx, cy,   s.width, gH,  0x3a7d44).setDepth(-5);
      this.add.rectangle(cx, gY+4, s.width, 8,   0x5aad64).setDepth(-4);
      // Physics.
      const b = this.groundGroup.create(cx, cy, 'pixel');
      b.setDisplaySize(s.width, gH).setVisible(false).refreshBody();
    });

    level.staticPlatforms.forEach(p => {
      // Visual.
      this.add.rectangle(p.x, p.y,   p.width, p.height, 0x4a9d54).setDepth(-4);
      this.add.rectangle(p.x, p.y-3, p.width, 5,        0x7bc67e).setDepth(-3);
      // Physics.
      const b = this.groundGroup.create(p.x, p.y, 'pixel');
      b.setDisplaySize(p.width, p.height).setVisible(false).refreshBody();
    });
  }

  // ── Per-frame update ────────────────────────────────────────────────────────
  update() {
    if (this.won) return;

    this.character.update();
    this.drawingSystem.update();

    // Notify UIScene of platform count changes.
    const count = this.drawingSystem.platforms.length;
    if (count !== this._lastPlatformCount) {
      this._lastPlatformCount = count;
      getEventBus().emit('platform-count', { count });
    }
  }

  shutdown() {
    this.inputManager?.destroy();
    this.drawingSystem?.destroy();
  }
}
