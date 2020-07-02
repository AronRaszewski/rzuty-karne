class Game {
  constructor(shoots, cfg, ...nicks) {
    this.nicks = nicks;
    this.score = [0,0];
    this.round = 0;
    this.roundProgress = 0; //0 - first shoot in this round, 1 - second ...
    this.shoots = shoots;
    this.result = false; //false - no goal, true - goal
    this.active = 0; //sector
	  this.saveTime = cfg.saveTime;
  }

  nextRound() {
    this.score[this.shoots] += +this.result;
    this.result = false;
    this.shoots = 1 - this.shoots;
    if (this.score[0]!=this.score[1] && this.round>=2 && this.roundProgress)
    {
      let min = Math.min(...this.score);
      let max = Math.max(...this.score);
      if (min+4-this.round < max)
        return this.end();
    }
    if (this.round > 3 && this.roundProgress)
    {
      if (this.score[0] != this.score[1])
      {
        return this.end();
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

  end() {
    console.log(`End result: ${this.nicks[0]} ${this.score[0]} - ${this.score[1]} ${this.nicks[1]}`);
    return this.score;
  }


}

module.exports = Game;
