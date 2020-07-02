const Express = require('express');
const App = Express();
const Server = require('http').createServer(App);
const IO = require('socket.io')(Server);
const port = 80;
const MatchOpponent = require('./server/match-opponent');
const match = new MatchOpponent(IO);
const Game = require('./server/game');
const games = [];
App.use(Express.static('public'));

App.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
})

Server.listen(port, () => {
  console.log(`Listening on *:${port}`);
});

IO.on('connection', (socket) => {

  socket.on('join', ({nick}) => {
    socket.nick = nick;
    console.log(`${nick} joined!`);
    match.join(socket);
    var matching = match.matchMe(socket);
    if (matching)
    {
      let {opponent, room} = matching;
      let cfg = {
        saveTime: 350
      }
      socket.join(room);
      opponent.join(room);
      IO.to(room).emit('start', cfg);
      let rand = 2*Math.random()>1 ? 0 : 1;
      opponent.emit('settings', {role: rand ? 'defend' : 'shoot', yourScore: 'p1'});
      socket.emit('settings', {role: rand ? 'shoot' : 'defend', yourScore: 'p2'});
      games[room] = new Game(rand, cfg, socket.nick, opponent.nick);
    }
  })

  socket.on('select', ({n, role, time}) => {
    var room = Object.keys(socket.rooms).find(el => el.match(/^Game \d+$/i));
    var thisGame = games[room];
    switch (role) {
      case 'shoot':
      {
        //console.log(room);
        socket.broadcast.to(room).emit('shoot', n);
        thisGame.result = true;
        thisGame.active = n;
        setTimeout(() => {
          var {round, shoots, result} = thisGame;
          IO.to(room).emit('result', {round, shoots, result});

          var endResult = thisGame.nextRound();
          if (endResult)
          {

            IO.to(room).emit('end', endResult);
            IO.sockets.in(room).clients((err, sockets) => {
              if (err) throw err;

              sockets.forEach((s) => {IO.sockets.sockets[s].leave(room)});
            })
          }
          else
          {
            IO.to(room).emit('switchRole');
          }
        }, 1000);
      }
      break;
      case 'defend':
      if (thisGame.active==n && time <= thisGame.saveTime)
      {
        thisGame.result = false;
      }
      break;
    }
  })


  socket.on('disconnect', () => {
    console.log('An user has left');
    match.leave(socket);
  })

})
