// 2D - Allows us to set x, y, height, width
// Canvas - The entity should be drawn onto the canvas
// Color - Allows us to set the color that is drawn
// Fourway - WASD and arrows control movement
// Solid - I think this might be defined by me.
// Collision - Detect collisions with other entities.

// The Grid component allows an element to be located on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },
 
  // Locate this entity at the given position on the grid
  // WTF - Why does this return something? Where does the function say what it is returning.
  //       When this is called in game.js, nothing stores the instance.
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  }
});
 
// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  },
});
 
// A Tree is just an Actor with a certain color
Crafty.c('Tree', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 125, 40)');
  },
});
 
// A Bush is just an Actor with a certain color
Crafty.c('Bush', {
  init: function() {
    this.requires('Actor, Solid, spr_bush');
  },
});

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('Actor, Fourway, Collision, spr_player')
      .fourway(4)
      .stopOnSolids()
      .onHit('Village', this.visitVillage);
  },

  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);
    return this; // cuz the init function requires these guys to return 'this'
  },

  // this does not return this, because onHit must not require that
  stopMovement: function() {
    this._speed = 0;
    // We just moved into it, so we must move back out?
    if(this._movement) {
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  },

  visitVillage: function(data) {
    village = data[0].obj;
    village.collect();
  }
});

Crafty.c('Village', {
  init: function() {
    this.requires('Actor, spr_village');
  },

  collect: function() {
    this.destroy();
    Crafty.trigger('VillageVisited', this);
  }
});
