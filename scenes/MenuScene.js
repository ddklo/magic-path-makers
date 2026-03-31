import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    // Sky background.
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x87CEEB);

    // Decorative ground strip.
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 30, GAME_WIDTH, 60, 0x3a7d44);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 57, GAME_WIDTH, 6, 0x5aad64);

    // Simple trees.
    this._drawTree(120, GAME_HEIGHT - 60, 80);
    this._drawTree(680, GAME_HEIGHT - 60, 100);
    this._drawTree(760, GAME_HEIGHT - 60, 70);

    // Title.
    this.add.text(GAME_WIDTH / 2, 100, 'Magic Path\nMakers', {
      fontFamily: "'Fredoka One', sans-serif",
      fontSize:   '52px',
      color:      '#FFFFFF',
      stroke:     '#2E7D32',
      strokeThickness: 6,
      align:      'center',
    }).setOrigin(0.5);

    // Subtitle.
    this.add.text(GAME_WIDTH / 2, 195, 'Draw paths to guide your friend home!', {
      fontFamily: "'Fredoka One', sans-serif",
      fontSize:   '18px',
      color:      '#FAFAFA',
      stroke:     '#1B5E20',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Play button.
    const btnBg = this.add.rectangle(GAME_WIDTH / 2, 300, 200, 60, 0xFF8C00)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(3, 0xCC6600);

    this.add.text(GAME_WIDTH / 2, 300, 'PLAY!', {
      fontFamily: "'Fredoka One', sans-serif",
      fontSize:   '30px',
      color:      '#FFFFFF',
    }).setOrigin(0.5);

    // Hover effects.
    btnBg.on('pointerover',  () => btnBg.setFillColor(0xFFA333));
    btnBg.on('pointerout',   () => btnBg.setFillColor(0xFF8C00));
    btnBg.on('pointerdown',  () => {
      this.cameras.main.fade(300, 0, 0, 0, false, (cam, progress) => {
        if (progress === 1) {
          this.scene.stop();
          this.scene.start('GameScene');
        }
      });
    });

    // Hint text.
    this.add.text(GAME_WIDTH / 2, 390, 'Draw lines with your finger or mouse', {
      fontFamily: "'Fredoka One', sans-serif",
      fontSize:   '14px',
      color:      '#E8F5E9',
    }).setOrigin(0.5);
  }

  _drawTree(x, baseY, height) {
    const g = this.add.graphics();
    g.fillStyle(0x4E342E);
    g.fillRect(x - 8, baseY - 20, 16, 22);
    g.fillStyle(0x2E7D32);
    g.fillTriangle(x - 30, baseY - 15, x, baseY - 15 - height, x + 30, baseY - 15);
    g.fillStyle(0x388E3C);
    g.fillTriangle(x - 24, baseY - 30, x, baseY - 30 - height * 0.75, x + 24, baseY - 30);
    g.fillStyle(0x43A047);
    g.fillTriangle(x - 18, baseY - 45, x, baseY - 45 - height * 0.5, x + 18, baseY - 45);
  }
}
