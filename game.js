import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { UIScene }   from './scenes/UIScene.js';
import { GAME_WIDTH, GAME_HEIGHT, GRAVITY } from './utils/constants.js';

const config = {
  type:            Phaser.AUTO,
  backgroundColor: '#000000',
  scene:           [BootScene, MenuScene, GameScene, UIScene],

  scale: {
    mode:       Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width:      GAME_WIDTH,
    height:     GAME_HEIGHT,
  },

  physics: {
    default: 'arcade',
    arcade:  {
      gravity: { y: GRAVITY },
      debug:   false,
    },
  },

  input: {
    activePointers: 2,  // supports two-finger touch (future co-op)
  },
};

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config);
