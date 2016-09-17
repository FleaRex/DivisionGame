"use strict";

(function(){
  var Container = PIXI.Container;
  var Graphics = PIXI.Graphics;
  var Text = PIXI.Text;
  var Texture = PIXI.Texture;
  var Sprite = PIXI.Sprite;
  var tileDimension = 150;

  console.log(PIXI);

  var gamemaker = new GameMaker();
  gamemaker.createNewGame();

  var renderer = PIXI.autoDetectRenderer(
    256, 256,
    {antialias: false, transparent: false, resolution: 1}
  );

  renderer.view.style.position = "absolute";
  renderer.view.style.display = "block";
  renderer.autoResize = true;
  renderer.resize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.view);

  var stage = new Container();
  stage.x = 40;
  stage.y = 40;
  var tileTexture = Texture.fromImage(['TileSprite.png']);
  var startTexture = Texture.fromImage(['StartSprite.png']);
  var finishTexture = Texture.fromImage(['FinishSprite.png']);
  var skaterTexture = Texture.fromImage(['SkaterSprite.png']);

  animate();

  function animate() {
    requestAnimationFrame(animate);
    if(gamemaker.skater.tile == gamemaker.gameboard.finish){
      gamemaker.createNewGame();
    }
    drawGrid(gamemaker.gameboard, tileDimension);
    drawSkater(gamemaker.skater, tileDimension);
    renderer.render(stage);
  }

  function drawSkater(activeSkater, dimension){
    var skaterSprite = new Sprite(skaterTexture);
    var numberText = new Text(gamemaker.skater.number,
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

      if(gamemaker.skater.tile == gamemaker.gameboard.start){
        skaterElement.y = (gamemaker.gameboard.height * 0.5)*dimension;
        skaterElement.x = 0.5*dimension;
      }
      else if(gamemaker.skater.tile == gamemaker.gameboard.finish){
        skaterElement.y = (gamemaker.gameboard.height * 0.5)*dimension;
        skaterElement.x = (1.5 + gamemaker.gameboard.width)*dimension;
      }
      else{
        skaterElement.y = (gamemaker.skater.tile.i + 0.5)*dimension;
        skaterElement.x = (gamemaker.skater.tile.j + 1.5)*dimension;
      }

      stage.addChild(skaterElement);
    });
  }

  function drawGrid(board, dimension){
    stage.board = board;
    // var gridGraphics = new Graphics();
    // stage.addChild(gridGraphics);
    // gridGraphics.lineStyle(2, 0x000000, 1);
    // gridGraphics.beginFill(0xFFFFFF, 1);
    // gridGraphics.drawRect(0, 0, dimension, dimension*board.height);
    // gridGraphics.drawRect(dimension*(board.width + 1), 0, dimension, dimension*board.height);
    var startSprite = new Sprite(startTexture);
    startSprite.tile = board.start;
    startSprite.y = (board.height)*dimension * 0.5;
    startSprite.x = 0.5 * dimension;
    startSprite.tint = 0x00FF00;
    startSprite.tint = gamemaker.skater.findPossibleSquares().indexOf(board.start) != -1 ?
                          0x00FF00 : 0x008800;

    var finishSprite = new Sprite(finishTexture);
    finishSprite.tile = board.finish;
    finishSprite.y = (board.height)*dimension * 0.5;
    finishSprite.x = (board.width + 1.5)*dimension;
    finishSprite.tint = gamemaker.skater.findPossibleSquares().indexOf(board.finish) != -1 ?
                          0x00FF00 : 0x008800;


    [startSprite, finishSprite].forEach(function(tileElement){
      tileElement.anchor.x = 0.5;
      tileElement.anchor.y = 0.5;
      tileElement.scale.x = dimension/100.0;
      tileElement.scale.y = dimension/100.0;
      tileElement.on('mousedown', clickTile);
      tileElement.on('touchstart', clickTile);
      tileElement.buttonMode = true;
      tileElement.interactive = true;
      stage.addChild(tileElement);
    });

    for(var row = 0; row < board.height; row++){
      for(var column = 0; column < board.width; column++){
        drawTile(board.grid[row][column], dimension, gamemaker.skater, stage);
      }
    }
  }

  function drawTile(tile, dimension, activeSkater, container){
    var tileSprite = new Sprite(tileTexture);
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
    tileSprite.on('mousedown', clickTile);
    tileSprite.on('touchstart', clickTile);
    tileSprite.buttonMode = true;
    tileSprite.interactive = true;
    var numberText = new Text(tile.number,
      {
        fontFamily: 'Arial',
        fontSize: 64,
        fill: '#3498db',
        align: 'center',
        stroke: '#34495e',
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

  function clickTile(eventData){
    console.log("CLICK");
    if(gamemaker.skater.findPossibleSquares().indexOf(this.tile) == -1){
      console.log("Not in possible");
      return;
    }
    if(this.tile.number % gamemaker.skater.number != 0){
      console.log("Doesn't divide.");
      return;
    }
    else if(this.tile == gamemaker.gameboard.finish){
      console.log("WINNING");
    }
    gamemaker.skater.tile = this.tile;
  }



}());
