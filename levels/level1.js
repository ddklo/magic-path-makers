// Forest level — the world is 5000 × 720 px.
// Ground top surface is at y = 660.  Character spawns above that.
// Gaps in the ground are where the player must draw platforms.

export const level1 = {
  worldWidth:  5000,
  worldHeight: 720,
  background:  'forest',
  spawnPoint:  { x: 120, y: 580 },

  // Ground sections — {x: left edge, width}.
  // Gaps between sections are where the player must draw.
  groundSections: [
    { x: 0,    width: 570  },  // section 1  → gap 1 at x=570
    { x: 870,  width: 450  },  // section 2  → gap 2 at x=1320
    { x: 1720, width: 500  },  // section 3  → gap 3 at x=2220
    { x: 2620, width: 480  },  // section 4  → gap 4 at x=3100
    { x: 3520, width: 1480 },  // section 5  → portal at end
  ],

  // Pre-built floating stepping-stone platforms.
  // These help with wider gaps but don't solve them alone.
  staticPlatforms: [
    { x: 1490, y: 575, width: 120, height: 16 },  // middle of gap 2
    { x: 3250, y: 565, width: 100, height: 16 },  // gap 4 stepping stone 1
    { x: 3450, y: 580, width: 100, height: 16 },  // gap 4 stepping stone 2
  ],

  // Gaps (documentation only — not used by engine code).
  gaps: [
    { from: 570,  to: 870  },  // 300 px — needs 1 drawn platform
    { from: 1320, to: 1720 },  // 400 px — stepping stone + 1 drawn platform
    { from: 2220, to: 2620 },  // 400 px — needs 1 drawn platform
    { from: 3100, to: 3520 },  // 420 px — 2 stepping stones + 1 drawn platform
  ],

  // Rocks block the path until tapped.  y=636 puts their base at ground level.
  rocks: [
    { x: 320,  y: 636 },
    { x: 1050, y: 636 },
    { x: 1900, y: 636 },
    { x: 2800, y: 636 },
    { x: 3700, y: 636 },
    { x: 4200, y: 636 },
  ],

  // Stars — 10 total.  Some float in mid-air, some are on the ground path.
  stars: [
    { x: 200,  y: 616 },
    { x: 710,  y: 555 },  // floating in gap 1
    { x: 1000, y: 616 },
    { x: 1490, y: 545 },  // above floating platform in gap 2
    { x: 2100, y: 616 },
    { x: 2410, y: 545 },  // floating in gap 3
    { x: 2900, y: 616 },
    { x: 3350, y: 535 },  // between stepping stones in gap 4
    { x: 3900, y: 616 },
    { x: 4400, y: 616 },
  ],

  portalX: 4800,
  portalY:  608,
};
