Crafty.scene(
  
  'Game', 

  function() {

    this.occupied = new Array(Game.map_grid.width);
    for(var x=0; x<Game.map_grid.width; ++x){
      this.occupied[x] = new Array(Game.map_grid.height);
      for(var y=0; y<Game.map_grid.height; ++y)
        this.occupied[x][y] = false;
    }

    // Place the player
    this.player = Crafty.e('PlayerCharacter').at(5,5);
    this.occupied[this.player.at().x][this.player.at().y] = true;

    // Place tres around edge, and bushes randomly in the middle
    for(var x=0; x<Game.map_grid.width; ++x)
      for(var y=0; y<Game.map_grid.height; ++y){
        var atEdge = (x==0) || (x==Game.map_grid.width-1) || (y==0) || (y==Game.map_grid.height-1);
        if(atEdge){
          Crafty.e('Tree').at(x,y);
          this.occupied[x][y] = true;
        }else if(Math.random() < 0.06 && !this.occupied[x][y]){
          Crafty.e('Bush').at(x,y);
          this.occupied[x][y] = true;
        }
      }

    // Place 5 villages
    while(Crafty('Village').length < 5){
      var x = Math.floor(Math.random()*(Game.map_grid.width-2)+1);
      var y = Math.floor(Math.random()*(Game.map_grid.height-2)+1);
      if(!this.occupied[x][y])
        Crafty.e('Village').at(x,y);
    }

    this.show_victory = this.bind('VillageVisited', function() {
      if(!Crafty('Village').length)
        Crafty.scene('Victory');
    });
  },

  function(){
    this.unbind('VillageVisited', this.show_victory);
  }

);

Crafty.scene(

  'Victory',

  function(){

    Crafty.e('2D, DOM, Text')
      .attr({ x:0, y:0 })
      .text('Victory!');

    this.restart_game = this.bind(
      'KeyDown', 
      function(){
        Crafty.scene('Game');
      }
    );

  },

  function(){
    this.unbind('KeyDown', this.restart_game);
  }

);
