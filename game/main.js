"use strict";

(function(){
  var Container = PIXI.Container;
  var Graphics = PIXI.Graphics;
  var Text = PIXI.Text;
  var Texture = PIXI.Texture;
  var Sprite = PIXI.Sprite;
  var tileDimension = 100;
  //Test that Pixi is working
  console.log(PIXI);

  //Create the renderer
  var renderer = PIXI.autoDetectRenderer(
    256, 256,
    {antialias: false, transparent: false, resolution: 1}
  );

  renderer.view.style.position = "absolute";
  renderer.view.style.display = "block";
  renderer.autoResize = true;
  renderer.resize(window.innerWidth, window.innerHeight);

  //Add the canvas to the HTML document
  document.body.appendChild(renderer.view);

  //Create a container object called the `stage`
  var stage = new Container();
  stage.x = 40;
  stage.y = 40;
  var tileTexture = Texture.fromImage(['TileSprite.png']);
  var skaterTexture = Texture.fromImage(['SkaterSprite.png']);

  var gameboard = new Gameboard([[24,72,36,30],
                                 [15,25,16,12],
                                 [8,40,45,18]]);
  // drawGrid(gameboard);

  //Tell the `renderer` to `render` the `stage`
  var skater = new Frog(2, gameboard);
  drawGrid(gameboard, tileDimension, skater);
  drawSkater(skater);
  animate();

  function animate() {
    requestAnimationFrame(animate);
    drawGrid(gameboard, tileDimension, skater);
    drawSkater(skater, tileDimension);
    renderer.render(stage);
  }

  function drawSkater(activeSkater, dimension){
    var skaterSprite = new Sprite(skaterTexture);
    var numberText = new Text(skater.number,
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

      if(skater.tile == gameboard.start){
        skaterElement.y = (gameboard.height * 0.5)*dimension;
        skaterElement.x = 0.5*dimension;
      }
      else if(skater.tile == gameboard.finish){
        skaterElement.y = (gameboard.height * 0.5)*dimension;
        skaterElement.x = (0.5 + gameboard.width)*dimension;
      }
      else{
        skaterElement.y = (skater.tile.i + 0.5)*dimension;
        skaterElement.x = (skater.tile.j + 1.5)*dimension;
      }

      stage.addChild(skaterElement);
    });
  }

  function drawGrid(board, dimension, activeSkater){
    stage.board = board;
    var gridGraphics = new Graphics();
    stage.addChild(gridGraphics);
    gridGraphics.lineStyle(2, 0x000000, 1);
    gridGraphics.beginFill(0xFFFFFF, 1);
    gridGraphics.drawRect(0, 0, dimension, dimension*board.height);
    gridGraphics.drawRect(dimension*(board.width + 1), 0, dimension, dimension*board.height);
    for(var row = 0; row < board.height; row++){
      for(var column = 0; column < board.width; column++){
        drawTile(board.grid[row][column], dimension, activeSkater, stage);
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


    function clickTile(eventData){
      console.log("CLICK");
      if(skater.findPossibleSquares().indexOf(this.tile) == -1){
        console.log("Not in possible");
        return;
      }
      if(this.tile.number % skater.number != 0){
        console.log("Doesn't divide.");
        return;
      }
      skater.tile = this.tile;
    }
  }

}());
