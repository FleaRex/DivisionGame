"use strict";

(function(){
  var Container = PIXI.Container;
  var graphics = new PIXI.Graphics();
  var Text = PIXI.Text;
  var Texture = PIXI.Texture;
  var Sprite = PIXI.Sprite;

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
  stage.addChild(graphics);

  var tileTexture = Texture.fromImage('TileSprite.png');

  var gameboard = new Gameboard([[1,2,3],[4,5,6],[7,8,9]]);
  // drawGrid(gameboard);

  //Tell the `renderer` to `render` the `stage`
  animate();

  function animate() {
    drawGrid(gameboard);
    requestAnimationFrame(animate);
    renderer.render(stage);
  }

  function drawGrid(board){
    var gridContainer = new Container()
    gridContainer.board = board;
    stage.addChild(gridContainer);
    for(var column = 0; column < board.width; column++){
      for(var row = 0; row < board.height; row++){
        drawTile(board.grid[column][row], 100, gridContainer);
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
      tileElement.x = (tile.j + 0.5)*dimension;
      tileElement.anchor.x = 0.5;
      tileElement.anchor.y = 0.5;
      container.addChild(tileElement);
    })


    function onDown(eventData){
      this.tile.active = true;
      console.log("CLICK");
    }
  }

}());
