import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants.js';
import { getEventBus, resetEventBus } from '../utils/EventBus.js';
import { level1 } from '../levels/level1.js';

const TOTAL_STARS = level1.stars.length;

export class UIScene extends Phaser.Scene {
  constructor() { super({ key: 'UIScene' }); }

  create() {
    this.collected = 0;

    // Star counter.
    this.starText = this.add.text(16, 16, this._starLabel(), {
      fontFamily: "'Fredoka One', sans-serif",
      fontSize:   '22px',
      color:      '#FFD700',
      stroke:     '#333',
      strokeThickness: 4,
    }).setDepth(100);

    // Hint text (fades out after a few seconds).
    const hint = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 20,
      'Draw lines over gaps  •  Tap rocks to break them', {
        fontFamily: "'Fredoka One', sans-serif",
        fontSize:   '13px',
        color:      '#FFFFFF',
        stroke:     '#000000',
        strokeThickness: 3,
        alpha: 0.9,
      }).setOrigin(0.5).setDepth(100);

    this.time.delayedCall(6000, () => {
      this.tweens.add({ targets: hint, alpha: 0, duration: 1500 });
    });

    // Platform cap counter (top-right).
    this.platformText = this.add.text(GAME_WIDTH - 16, 16, '', {
      fontFamily: "'Fredoka One', sans-serif",
      fontSize:   '14px',
      color:      '#00E676',
      stroke:     '#333',
      strokeThickness: 3,
      align: 'right',
    }).setOrigin(1, 0).setDepth(100);

    this._bindEvents();
  }

  _bindEvents() {
    const bus = getEventBus();

    bus.on('star-collected', () => {
      this.collected++;
      this.starText.setText(this._starLabel());
      this._popText(this.starText);
    }, this);

    bus.on('player-won', () => {
      this._showWinScreen();
    }, this);

    bus.on('player-respawned', () => {
      this._showRespawnFlash();
    }, this);

    bus.on('platform-count', ({ count }) => {
      this.platformText.setText(count > 0 ? `Paths: ${count}/8` : '');
    }, this);
  }

  _starLabel() {
    return `★ ${this.collected} / ${TOTAL_STARS}`;
  }

  _popText(text) {
    this.tweens.add({
      targets:  text,
      scaleX:   1.35,
      scaleY:   1.35,
      duration: 100,
      yoyo:     true,
    });
  }

  _showWinScreen() {
    // Dim overlay.
    const overlay = this.add.rectangle(
      GAME_WIDTH / 2, GAME_HEIGHT / 2,
      GAME_WIDTH, GAME_HEIGHT,
      0x000000, 0
    ).setDepth(200);

    this.tweens.add({ targets: overlay, alpha: 0.55, duration: 600 });

    // Panel.
    const panel = this.add.rectangle(
      GAME_WIDTH / 2, GAME_HEIGHT / 2,
      420, 260,
      0x1B5E20
    ).setStrokeStyle(4, 0x00E676).setDepth(201).setAlpha(0);

    this.tweens.add({ targets: panel, alpha: 1, duration: 500, delay: 300 });

    // "Level Complete!" text.
    const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 75, '🎉 Level Complete!', {
      fontFamily: "'Fredoka One', sans-serif",
      fontSize:   '34px',
      color:      '#FFD700',
      stroke:     '#1B5E20',
      strokeThickness: 5,
    }).setOrigin(0.5).setDepth(202).setAlpha(0).setScale(0.5);

    this.tweens.add({ targets: title, alpha: 1, scaleX: 1, scaleY: 1, duration: 500, delay: 500, ease: 'Back.Out' });

    // Stars collected.
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 18,
      `Stars collected: ${this.collected} / ${TOTAL_STARS}`, {
        fontFamily: "'Fredoka One', sans-serif",
        fontSize:   '20px',
        color:      '#FFFFFF',
      }).setOrigin(0.5).setDepth(202).setAlpha(0);

    this.time.delayedCall(900, () => {
      this.children.getChildren()
        .filter(c => c.type === 'Text' && c.depth === 202)
        .forEach(c => this.tweens.add({ targets: c, alpha: 1, duration: 400 }));
    });

    // Play Again button.
    this.time.delayedCall(1200, () => {
      const btnBg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 65, 200, 52, 0xFF8C00)
        .setInteractive({ useHandCursor: true })
        .setStrokeStyle(3, 0xCC6600)
        .setDepth(202);

      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 65, 'Play Again', {
        fontFamily: "'Fredoka One', sans-serif",
        fontSize:   '24px',
        color:      '#FFFFFF',
      }).setOrigin(0.5).setDepth(203);

      btnBg.on('pointerover',  () => btnBg.setFillColor(0xFFA333));
      btnBg.on('pointerout',   () => btnBg.setFillColor(0xFF8C00));
      btnBg.on('pointerdown',  () => {
        resetEventBus();
        this.scene.stop();
        this.scene.start('GameScene');
      });
    });
  }

  _showRespawnFlash() {
    const msg = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, 'Oops! Try again!', {
      fontFamily: "'Fredoka One', sans-serif",
      fontSize:   '26px',
      color:      '#FF5252',
      stroke:     '#333',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(150).setAlpha(0);

    this.tweens.add({
      targets:  msg,
      alpha:    1,
      duration: 200,
      yoyo:     true,
      hold:     1000,
      onComplete: () => msg.destroy(),
    });
  }

  shutdown() {
    const bus = getEventBus();
    bus.off('star-collected',   undefined, this);
    bus.off('player-won',       undefined, this);
    bus.off('player-respawned', undefined, this);
    bus.off('platform-count',   undefined, this);
  }
}
