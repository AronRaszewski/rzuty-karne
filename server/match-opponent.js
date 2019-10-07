//const Game = require('./game');
class MatchOpponent {
  constructor() {
    this.freePlayers = [];
    this.gameNum = 0;
  }

  join(socket) {
    this.freePlayers.push(socket);
    console.log(`Free Players: ${this.freePlayers.length}`);
  }

  leave({id}) {
    var ids = this.freePlayers.reduce((prev, cur) => prev.concat(cur.id), []);
    this.freePlayers.splice(ids.indexOf(id), 1);
  }

  matchMe({id}) {
    if (this.freePlayers.length < 2)
      return false;
    {
      let ids = this.freePlayers.reduce((prev, cur) => prev.concat(cur.id), []);
      let index = ids.indexOf(id);
      this.freePlayers.splice(index, 1);
    }
    this.gameNum++;
    return {
      opponent: this.freePlayers.shift(),
      room: `game ${this.gameNum}`
    }
  }
}

module.exports = MatchOpponent;
