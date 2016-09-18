class GameMaker{
  constructor(){
    this.breadth = 4;
    this.length = 7;
    this.timesTables = [3,4,5,6,7,8,9,11,12];
  }

  createNewGame(){
    var timesTable = this.getRandomTimesTable();
    var grid = [];
    for(var i = 0; i < this.breadth; i++){
      grid[i] = []
      for(var j = 0; j < this.length; j++){
        grid[i][j] = this.getNonMultiple(timesTable);
      }
    }
    var currentCoords = {'i': Math.floor(Math.random() * this.breadth), 'j':0};
    grid[currentCoords.i][currentCoords.j] = this.getMultiple(timesTable);
    while(currentCoords.j < this.length){
      grid[currentCoords.i][currentCoords.j] = this.getMultiple(timesTable);;
      var pathDecider = Math.random();
      if(pathDecider < 0.35){
        if(currentCoords.i > 0){
          currentCoords.i -= 1;
          grid[currentCoords.i][currentCoords.j] = this.getMultiple(timesTable);;
        }
      }
      else if(pathDecider < 0.7){
        if(currentCoords.i < this.breadth - 1){
          currentCoords.i += 1;
          grid[currentCoords.i][currentCoords.j] = this.getMultiple(timesTable);;
        }
      }
      currentCoords.j += 1;
    }

    this.gameboard = new Gameboard(grid);

    this.skater = new Frog(timesTable, this.gameboard);
  }

  getMultiple(number){
    return number * this.getRandomTimesTable();
  }

  getNonMultiple(number){
    return this.getRandomTimesTable() * this.getRandomTimesTable();
  }

  getRandomTimesTable(){
    return this.timesTables[Math.floor(Math.random() * this.timesTables.length)];
  }

  destroyTile(tile){
    this.gameboard.grid[tile.i][tile.j].broken = true;
  }
}
