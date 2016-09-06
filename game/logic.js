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
    this.grid = new Array(numberGrid.length);
    for(var column = 0; column < this.width; column++){
      grid[column] = new Array(numberGrid.height);
      for(var row = 0; row < this.height; row++){
        grid[column][row] = new Tile(column, row, numberGrid[column][row]);
      }
    }
  }

}
