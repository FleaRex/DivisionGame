class GameMaker{
  createNewGame(){
    this.gameboard = new Gameboard([[24,72,36,30],
                               [15,25,16,12],
                               [8,40,45,18]]);

    this.skater = new Frog(6, this.gameboard);
  }
}
