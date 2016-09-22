class GameMaker{
  constructor(){
    // May wanna make these static.
    this.breadth = 6;
    this.length = 8;
    this.timesTables = [6,7,8,9,11,12];
  }

  createNewGame(){
    var timesTable = this.getTimesTable();
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

    this.skater = new Skater(timesTable, this.gameboard);
  }

  getMultiple(number){
    return number * this.getRandomTimesTable();
  }

  // Attempt to limit the number of accidental hits.
  getNonMultiple(number){
    var maxAttempts = 2;
    console.log(arguments[1]);
    var currentAttempt = arguments[1] || 1;
    var value = this.getRandomTimesTable() * this.getRandomTimesTable();
    if((value % number != 0) || (currentAttempt >= maxAttempts)){
      return value;
    }
    else {
      return this.getNonMultiple(number, currentAttempt + 1);
    }
  }

  getTimesTable(){
    return this.getRandomTimesTable();
  }

  getRandomTimesTable(){
    return this.timesTables[Math.floor(Math.random() * this.timesTables.length)];
  }

  destroyTile(tile){
    this.gameboard.grid[tile.i][tile.j].broken = true;
  }

  wrongAnswer(tile){
    return;
  }
  rightAnswer(tile){
    return;
  }
  toStart(){
    return;
  }
  tofinish(){
    return;
  }
}


class Record{
  // dividend is on the back of skater, tileValue is int or start/finish
  constructor(dividend, tileValue){
    this.dividend = divident;
    this.tileValue = tileValue;
    this.attemptTime = Date.now();
  }
}

class BespokeGameMaker extends GameMaker{
  // history = {timesTables:[], problemTables:[],
  //            misconceptions:[[a, b, proposedab]],
  //            wrongAnswers:[a, proposedadivides]}
  constructor(history){
    super();
    this.timesTables = history.timesTables;
    this.problemTables = history.problemTables;
    //Maybe this ends up with some chcking they are misconceptions.
    this.misconceptions = history.misconceptions;
    this.wrongAnswers = history.wrongAnswers;
    this.activity = [];
  }

  getMultiple(number){
    var potential = [];
    this.misconceptions.forEach(function(calculation){
      if((calculation[0] == number) || (calculation[1] == number)){
        potential.push(calculation[0]*calculation[1]);
      }
      if(calculation[2] % number == 0){
        potential.push(calculation[2]);
      }
    });
    if(Math.random() < potential.length * 0.05){
      return potential[Math.floor(Math.random() * potential.length)];
    }
    return number * this.getRandomTimesTable();
  }

  // Attempt to limit the number of accidental hits.
  getNonMultiple(number){
    var potential = [];
    this.misconceptions.forEach(function(calculation){
      if((calculation[0] == number) || (calculation[1] == number)){
        potential.push(calculation[2]);
      }
    });
    this.wrongAnswers.forEach(function(calculation){
      if(calculation[0] == number){
        potential.push(calculation[1]);
      }
    });
    if(Math.random() < potential.length * 0.05){
      return potential[Math.floor(Math.random() * potential.length)];
    }
    return super.getNonMultiple(number, arguments[1]);
  }

  getTimesTable(){
    if(Math.random()>0.5){
      return this.getRandomTimesTable();
    }
    else{
      return this.problemTables[Math.floor(Math.random() * this.problemTables.length)];
    }
  }

  getRandomTimesTable(){
    return this.timesTables[Math.floor(Math.random() * this.timesTables.length)];
  }

  wrongAnswer(tile){
    this.activity.push(new Record(this.skater.number, tile.number));
    var notIn = true;
    this.wrongAnswers.forEach(function(answer){
      if((answer[0] == this.skater.number) && (answer[1] == tile.number)){
        notIn = false;
      }
    }, this);
    if(notIn){
      this.wrongAnswers.push([this.skater.number, tile.number]);
    }
  }

  rightAnswer(tile){
    this.activity.push(new Record(this.skater.number, tile.number));
  }

  toStart(){
    this.activity.push(new Record(this.skater.number, 'start'));
  }

  tofinish(){
    this.activity.push(new Record(this.skater.number, 'finish'));
  }
}
