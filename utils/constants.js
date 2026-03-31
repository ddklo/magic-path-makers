export const GAME_WIDTH  = 800;
export const GAME_HEIGHT = 450;
export const WORLD_WIDTH  = 5000;
export const WORLD_HEIGHT = 720;

export const GRAVITY    = 700;
export const WALK_SPEED = 130;

export const MAX_DRAWN_PLATFORMS = 8;
export const PLATFORM_THICKNESS  = 14;
export const MIN_DRAW_LENGTH     = 50;
export const SIMPLIFY_TOLERANCE  = 8;

export const TAP_MAX_MOVE     = 15;   // px
export const TAP_MAX_DURATION = 350;  // ms

export const GROUND_TOP    = 660;
export const GROUND_HEIGHT = WORLD_HEIGHT - GROUND_TOP; // 60

export const COLORS = {
  sky:              0x87CEEB,
  ground:           0x3a7d44,
  groundTop:        0x5aad64,
  platformDrawing:  0xFFD700,
  platformPlaced:   0x00E676,
  platformGlow:     0xFFFFFF,
  character:        0xFF8C00,
  characterEye:     0x111111,
  rock:             0x888888,
  star:             0xFFDD00,
  portal:           0x9C27B0,
  portalInner:      0xCE93D8,
  portalCore:       0xF3E5F5,
};
