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

    // Display some text
    Crafty.e('2D, DOM, Text')
      .attr({ x:0, y:0 })
      .text('Victory!');

    // Restart the game when the player presses any key
    this.restart_game = this.bind(
      'KeyDown', 
      function(){
        Crafty.scene('Game');
      }
    );

  },

  // Unbind so we don't end up with multiple redundant watchers after multiple restarts of the game
  function(){
    this.unbind('KeyDown', this.restart_game);
  }

);

Crafty.scene(

  'Loading',

  function(){
    // Draw some text for the player to see in case the file takes a noticable amount of time to load
    Crafty.e('2D, DOM, Text')
      .text('Loading...')
      .attr({ x: 0, y: Game.height()/2-24, w: Game.width() });
      // .css($text_css);
    // Load our sprit map image
    Crafty.load(
      // The file to take the images from
      ['assets/16x16_forest_1.gif', 'assets/hunter.png', 'assets/door_knock_3x.mp3'], 
      // One the image is loaded, define the sprites
      function(){
        Crafty.sprite(
          16,
          'assets/16x16_forest_1.gif',
          {
            spr_tree: [0,0],
            spr_bush: [1,0],
            spr_village: [0,1],
          }
        );
        // Define the PC's sprite to be the first sprite in the third row of the animation sprite map
        Crafty.sprite(
          16,
          'assets/hunter.png',
          {
            spr_player: [0,2],
          },
          0,
          2
        );
        // Define our sounds for later use
        Crafty.audio.add(
          {
            knock: ['assets/door_knock_3x.mp3']
          }
        );
        // Make the game pause for a bit so we can see the loading screen
        for(var x=0; x<1e9; ++x)
          ;
        // Now that our sprites are ready to draw, start the game
        Crafty.scene('Game')
      }
    )
  }

);





