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

  var tileTexture = Texture.fromImage(['TileSprite.png']);
  var skaterTexture = Texture.fromImage(['SkaterSprite.png']);

  var gameboard = new Gameboard([[24,72,36,30],
                                 [15,25,16,12],
                                 [8,40,45,18],
                                 [22,12,35,27]]);
  // drawGrid(gameboard);

  //Tell the `renderer` to `render` the `stage`
  drawGrid(gameboard, tileDimension);
  animate();

  function animate() {
    requestAnimationFrame(animate);
    drawGrid(gameboard, tileDimension);
    renderer.render(stage);
  }

  function drawGrid(board, dimension){
    stage.x = 40;
    stage.y = 40;
    stage.board = board;
    var gridGraphics = new Graphics();
    stage.addChild(gridGraphics);
    gridGraphics.lineStyle(2, 0x000000, 1);
    gridGraphics.beginFill(0xFFFFFF, 1);
    gridGraphics.drawRect(0, 0, dimension, dimension*board.height);
    gridGraphics.drawRect(dimension*(board.width + 1), 0, dimension, dimension*board.height);
    for(var column = 0; column < board.width; column++){
      for(var row = 0; row < board.height; row++){
        drawTile(board.grid[column][row], dimension, stage);
      }
    }
  }

  function drawTile(tile, dimension, container){
    var tileSprite = new Sprite(tileTexture);
    tileSprite.tile = tile;
    tileSprite.tint = tile.active ? 0xFFFFFF : 0xA5F2F3;
    tileSprite.on('mousedown', onDown);
    tileSprite.on('touchstart', onDown);
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


    function onDown(eventData){
      this.tile.active = true;
      console.log("CLICK");
    }
  }

}());
