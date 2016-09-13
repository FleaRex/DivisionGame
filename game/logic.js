"use strict";


class Tile{
  constructor(i, j, number) {
    this.i = i;
    this.j = j;
    this.number = number;
  }
}

// Eventually we're gonna want some kind of gameboard factory.
// Want to deal with undefined.
class Gameboard{
  constructor(numberGrid){
    this.height = numberGrid.length;
    this.width = numberGrid[0].length;
    this.start = new Tile(-1, -1, 0);
    this.finish = new Tile(this.width, this.height, 0);
    this.grid = new Array(numberGrid.length);
    for(var row = 0; row < this.height; row++){
      this.grid[row] = new Array(numberGrid.height);
      for(var column = 0; column < this.width; column++){
        if(numberGrid[row][column] === undefined){
          continue;
        }
        this.grid[row][column] = new Tile(row, column, numberGrid[row][column]);
      }
    }
    this.entry = [];
    this.exit = [];
    for(var row = 0; row < this.height; row++){
      this.entry.push(this.grid[row][0]);
      this.exit.push(this.grid[row][this.width-1]);
    }

  }

}

class Frog{
  constructor(number, board){
    this.number = number;
    this.board = board;
    this.tile = board.start;
  }

  findPossibleSquares(){
    if(this.tile === this.board.start){
      return this.board.entry;
    }
    if(this.tile === this.board.finish){
      return [];
    }

    var possibleTiles = [];
    var tilesToAdd = [[this.tile.i-1, this.tile.j],[this.tile.i, this.tile.j+1],
                      [this.tile.i+1, this.tile.j]]
    tilesToAdd.forEach(function(pair){
      try{
        possibleTiles.push(this.board.grid[pair[0]][pair[1]]);
      }
      catch (TypeError){
        console.log(pair[0],pair[1]);
      }
    }, this)

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
