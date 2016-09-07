"use strict";

class Tile{
  constructor(i, j, number) {
    this.i = i;
    this.j = j;
    this.number = number;
  }
}

// Eventually we're gonna want some kind of gameboard factory.
class Gameboard{
  constructor(numberGrid){
    this.width = numberGrid.length;
    this.height = numberGrid[0].length;
    this.start = new Tile(-1, -1, 0);
    this.finish = new Tile(width, height, 0);
    this.grid = new Array(numberGrid.length);
    for(var column = 0; column < this.width; column++){
      grid[column] = new Array(numberGrid.height);
      for(var row = 0; row < this.height; row++){
        if(numberGrid[column][row] === undefined){
          continue;
        }
        grid[column][row] = new Tile(column, row, numberGrid[column][row]);
      }
    }
    this.entry = this.grid[0];
    this.exit = this.grid[width - 1];
  }

}

class Frog{
  constructor(number, board, tile){
    this.number = number;
    this.board = board;
    this.tile = tile;
  }

  findPossibleSquares(){
    if(this.tile === this.board.start){
      return this.board.entry;
    }
    if(this.tile === this.board.finish){
      return [];
    }

    var possibleTiles = [];
    for(var column = 0; column < this.board.width; column++){
      for(var row = 0; row < this.board.height; row++){
        if(this.tile.i in [column, column += 1] &&
           this.tile.j in [row - 1, row, row + 1]){
             possibleTiles.push(this.board.grid[column][row]);
        }
      }
    }
    if(this.tile in this.board.exit){
      possibleTiles.push(this.board.finish);
    }
    return possibleTiles;
  }

  canLandOn(tile){
    return ((tile in this.findPossibleSquares()) &&
            (tile.number % this.number == 0))
  }
}
