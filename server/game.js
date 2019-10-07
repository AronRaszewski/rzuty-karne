class Game {
  constructor(shoots) {
    this.score = [0,0];
    this.round = 0;
    this.roundProgress = 0; //0 - first shoot in this round, 1 - second ...
    this.shoots = shoots;
    this.result = false; //false - no goal, true - goal
    this.active = 0; //sector
  }

  nextRound() {
    this.score[this.shoots] += +this.result;
    this.result = false;
    this.shoots = 1 - this.shoots;
    if (this.round > 3 && this.roundProgress)
    {
      if (this.score[0] != this.score[1])
      {
        console.log(`End result: ${this.score[0]} - ${this.score[1]}`);
        return this.score;
      }
    }
    this.roundProgress++;
    if (this.roundProgress > 1)
    {
      this.round++;
      this.roundProgress = 0;
    }

    return false;
  }


}

module.exports = Game;
