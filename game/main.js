"use strict";

console.log(PIXI);
var Container = PIXI.Container;
var Graphics = PIXI.Graphics;
var Text = PIXI.Text;
var Texture = PIXI.Texture;
var Sprite = PIXI.Sprite;

class Game{
  constructor(){
    this.tileDimension = 75;
    this.gameState = 'playing';
    this.setUpRenderer();
    this.stage = new Container();

    this.gamemaker = new BespokeGameMaker({'timesTables':[4,5,6,7,8,9,10,11,12],
                                           'problemTables':[6,7,8,12],
                                           'misconceptions':[
                                                             [6,9,63],
                                                             [4,6,26],
                                                             [3,9,29],
                                                             [8,6,84],
                                                             [7,8,63]
                                                            ],
                                           'wrongAnswers':[[7,19],
                                                           [7,31],
                                                           [7,12]]
                                          });



    this.loading();
    this.gamemaker.createNewGame();
    this.animate();
  }

  setUpRenderer(){
    this.renderer = PIXI.autoDetectRenderer(
      256, 256,
      {antialias: false, transparent: false, resolution: 1}
    );

    this.renderer.view.style.position = "absolute";
    this.renderer.view.style.display = "block";
    this.renderer.autoResize = true;
    this.renderer.resize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.view);
  }

  loading(){
    this.tileTexture = Texture.fromImage(['TileSprite.png']);
    this.startTexture = Texture.fromImage(['StartSprite.png']);
    this.finishTexture = Texture.fromImage(['FinishSprite.png']);
    this.skaterTexture = Texture.fromImage(['SkaterSprite.png']);
    this.brokenTexture = Texture.fromImage(['BrokenSprite.png']);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    if(this.gamemaker.skater.tile == this.gamemaker.gameboard.finish){
      this.gamemaker.createNewGame();
    }
    this.drawGrid(this.gamemaker.gameboard, this.tileDimension);
    this.drawSkater(this.gamemaker.skater, this.tileDimension);
    this.renderer.render(this.stage);
  }

  drawSkater(activeSkater, dimension){
    var skaterSprite = new Sprite(this.skaterTexture);
    var numberText = new Text(this.gamemaker.skater.number,
      {
        fontFamily: 'Arial',
        fontSize: 44,
        fill: '#000000',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 0,
        lineJoin: 'round'
      }
    );
    skaterSprite.skater = activeSkater;

    [skaterSprite, numberText].forEach(function(skaterElement){
      skaterElement.anchor.x = 0.5;
      skaterElement.anchor.y = 0.5;
      skaterElement.scale.x = dimension/100.0;
      skaterElement.scale.y = dimension/100.0;

      if(this.gamemaker.skater.tile == this.gamemaker.gameboard.start){
        skaterElement.y = (this.gamemaker.gameboard.height * 0.5)*dimension;
        skaterElement.x = 0.5*dimension;
      }
      else if(this.gamemaker.skater.tile == this.gamemaker.gameboard.finish){
        skaterElement.y = (this.gamemaker.gameboard.height * 0.5)*dimension;
        skaterElement.x = (1.5 + this.gamemaker.gameboard.width)*dimension;
      }
      else{
        skaterElement.y = (this.gamemaker.skater.tile.i + 0.5)*dimension;
        skaterElement.x = (this.gamemaker.skater.tile.j + 1.5)*dimension;
      }

      this.stage.addChild(skaterElement);
    }, this);
  }

  drawGrid(board, dimension){
    this.stage.board = board;
    var startSprite = new Sprite(this.startTexture);
    startSprite.tile = board.start;
    startSprite.y = (board.height)*dimension * 0.5;
    startSprite.x = 0.5 * dimension;
    startSprite.tint = 0x00FF00;
    startSprite.tint = this.gamemaker.skater.findPossibleSquares().
      indexOf(board.start) != -1 ? 0x00FF00 : 0x008800;

    var finishSprite = new Sprite(this.finishTexture);
    finishSprite.tile = board.finish;
    finishSprite.y = (board.height)*dimension * 0.5;
    finishSprite.x = (board.width + 1.5)*dimension;
    finishSprite.tint = this.gamemaker.skater.findPossibleSquares().
      indexOf(board.finish) != -1 ? 0x00FF00 : 0x008800;


    [startSprite, finishSprite].forEach(function(tileElement){
      tileElement.anchor.x = 0.5;
      tileElement.anchor.y = 0.5;
      tileElement.scale.x = dimension/100.0;
      tileElement.scale.y = dimension/100.0;
      // tileElement.on('mousedown', clickTile);
      // tileElement.on('touchstart', clickTile);
      tileElement.buttonMode = true;
      tileElement.interactive = true;
      this.stage.addChild(tileElement);
    }, this);

    for(var row = 0; row < board.height; row++){
      for(var column = 0; column < board.width; column++){
        this.drawTile(board.grid[row][column], dimension,
                      this.gamemaker.skater, this.stage);
      }
    }
  }

  drawTile(tile, dimension, activeSkater, container){
    var tileSprite;
    var textFill;
    var textStroke;
    if(tile.broken){
      tileSprite = new Sprite(this.brokenTexture);
      textFill = '#999999';
      textStroke = '#333333';
    }
    else{
      tileSprite = new Sprite(this.tileTexture);
      textFill = '#3498db';
      textStroke = '#34495e';
      tileSprite.tile = tile;
      //What colour is the tile
      var tintColour = 0xA5F2F3;
      if(activeSkater.findPossibleSquares().indexOf(tile) != -1){
        tintColour = 0xD9D4AE;
      }
      if(activeSkater.tile == tile){
        tintColour = 0x888888;
      }

      tileSprite.tint = tintColour;
      // tileSprite.on('mousedown', clickTile);
      // tileSprite.on('touchstart', clickTile);
      tileSprite.buttonMode = true;
      tileSprite.interactive = true;
    }
    var numberText = new Text(tile.number,
      {
        fontFamily: 'Arial',
        fontSize: 56,
        fill: textFill,
        align: 'center',
        stroke: textStroke,
        strokeThickness: 5,
        lineJoin: 'round'
      }
    );
    [tileSprite, numberText].forEach(function(tileElement){
      tileElement.y = (tile.i + 0.5)*dimension;
      tileElement.x = (tile.j + 1.5)*dimension;
      tileElement.anchor.x = 0.5;
      tileElement.anchor.y = 0.5;
      tileElement.scale.x = dimension/100.0;
      tileElement.scale.y = dimension/100.0;
      container.addChild(tileElement);
    })
  }

  // function clickTile(eventData){
  //   console.log("CLICK");
  //   if(gamemaker.skater.findPossibleSquares().indexOf(this.tile) == -1){
  //     console.log("Not in possible");
  //     return;
  //   }
  //   if(this.tile.number % gamemaker.skater.number != 0){
  //     console.log("Doesn't divide.");
  //     gamemaker.wrongAnswer(this.tile);
  //     gamemaker.destroyTile(this.tile);
  //     return;
  //   }
  //
  //   if(this.tile == gamemaker.gameboard.finish){
  //     gameState = 'win';
  //     gamemaker.toFinish();
  //   }
  //   else if(this.tile == gamemaker.gameboard.start){
  //     gamemaker.toStart();
  //   }
  //   else{
  //     gamemaker.rightAnswer(this.tile);
  //   }
  //   gamemaker.skater.tile = this.tile;
  // }

}

(function(){

  var game = new Game();

}());
