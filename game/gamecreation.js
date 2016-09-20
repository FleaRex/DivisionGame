class GameMaker{
  constructor(){
    this.breadth = 6;
    this.length = 8;
    this.timesTables = [6,7,8,9,11,12];
  }

  createNewGame(){
    var timesTable = this.getRandomTimesTable();
    var grid = [];
    for(var i = 0; i < this.breadth; i++){
      grid[i] = []
      for(var j = 0; j < this.length; j++){
        grid[i][j] = this.getNonMultiple(timesTable);
        // grid[i][j] = 0;
      }
    }
    // TODO: Bias to start more central.
    var currentCoords = {'i': Math.floor(Math.random() * this.breadth), 'j':0};
    var lastMove = 'forwards';
    grid[currentCoords.i][currentCoords.j] = this.getMultiple(timesTable);
    // grid[currentCoords.i][currentCoords.j] = 1;
    while(currentCoords.j < this.length){
      grid[currentCoords.i][currentCoords.j] = this.getMultiple(timesTable);
      // grid[currentCoords.i][currentCoords.j] = 1;
      var pathDecider = Math.random();
      if(pathDecider < 0.35){
        if((currentCoords.i > 0) && (lastMove != 'down')){
          lastMove = 'up';
          currentCoords.i -= 1;
          grid[currentCoords.i][currentCoords.j] = this.getMultiple(timesTable);
          // grid[currentCoords.i][currentCoords.j] = 1;
        }
        else{
          lastMove = 'forwards';
        }
      }
      else if((pathDecider < 0.7) && (lastMove != 'up')){
        if(currentCoords.i < this.breadth - 1){
          lastMove = 'down';
          currentCoords.i += 1;
          grid[currentCoords.i][currentCoords.j] = this.getMultiple(timesTable);
          // grid[currentCoords.i][currentCoords.j] = 1;
        }
        else{
          lastMove = 'forwards';
        }
      }
      else{
        lastMove = 'forwards';
      }
      currentCoords.j += 1;
    }

    this.gameboard = new Gameboard(grid);

    this.skater = new Frog(timesTable, this.gameboard);
  }

  getMultiple(number){
    return number * this.getRandomTimesTable();
  }

  // Attempt to limit the number of accidental hits.
  getNonMultiple(number){
    var maxAttempts = 4;
    console.log(arguments[1]);
    var value = this.getRandomTimesTable() * this.getRandomTimesTable();
    if((value % number != 0) || (currentAttempt >= maxAttempts)){
      return value;
    }else {
      return this.getNonMultiple(number, currentAttempt + 1);
    }
  }

  getRandomTimesTable(){
    return this.timesTables[Math.floor(Math.random() * this.timesTables.length)];
  }

  destroyTile(tile){
    this.gameboard.grid[tile.i][tile.j].broken = true;
  }
}
