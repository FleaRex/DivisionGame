"use strict";

(function(){
  var container = PIXI.Container;
  var graphics = new PIXI.Graphics();

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
  var stage = new container();

  stage.addChild(graphics);

  var gameboard = new Gameboard([[1,2,3],[4,5,6],[7,8,9]]);
  drawGrid(gameboard);

  //Tell the `renderer` to `render` the `stage`
  renderer.render(stage);

  function drawGrid(board){
    for(var column = 0; column < board.width; column++){
      for(var row = 0; row < board.height; row++){
        drawTile(board.grid[column][row], 100);
      }
    }
  }

  function drawTile(tile, dimension){
    graphics.beginFill(0xFFFF00);

    // set the line style to have a width of 5 and set the color to red
    graphics.lineStyle(1, 0xFF0000);

    // draw a rectangle
    graphics.drawRect(tile.i*dimension, tile.j*dimension, dimension, dimension);
  }
}());
