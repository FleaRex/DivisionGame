class GameMaker{
  constructor(){
    this.breadth = 5;
    this.length = 7;
    this.timesTables = [3,4,5,6,7,8,9,11,12];
  }
  createNewGame(){
    var grid = [];
    for(var i = 0; i < this.breadth; i++){
      grid[i] = []
      for(var j = 0; j < this.length; j++){
        grid[i][j] = 1;
      }
    }
    var currentCoords = {'i': Math.floor(Math.random() * this.breadth), 'j':0};
    grid[currentCoords.i][currentCoords.j] = 2;
    while(currentCoords.j < this.length){
      grid[currentCoords.i][currentCoords.j] = 2;
      var pathDecider = Math.random();
      if(pathDecider < 0.35){
        if(currentCoords.i > 0){
          currentCoords.i -= 1;
          grid[currentCoords.i][currentCoords.j] = 2;
        }
      }
      else if(pathDecider < 0.7){
        if(currentCoords.i < this.breadth - 1){
          currentCoords.i += 1;
          grid[currentCoords.i][currentCoords.j] = 2;
        }
      }
      currentCoords.j += 1;
    }


    // this.gameboard = new Gameboard([[24,72,36,30],
    //                                 [15,25,16,12],
    //                                 [8,40,45,18]]);
    this.gameboard = new Gameboard(grid);

    this.skater = new Frog(2, this.gameboard);
  }
}
