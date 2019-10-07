const Socket = io();

const App = new Vue({
  el: '#app',
  data() {
    return {
      ok: true,
      score: {
        p1: [null, null, null, null, null],
        p2: [null, null, null, null, null]
      },
      role: '', //shoot or defend
      selected: false,
      active: null,
      status: '', //<empty>, queue, game
      shootTime: null,
      yourScore: null
    }
  },
  methods: {
    select(n) {
      if (!this.selected) {
        if (this.role=='defend')
        {
          time = Date.now() - this.shootTime;
        }
        else time = null;
        Socket.emit('select', {n, role: this.role, time});
        this.selected = true;


      }

    },
    set(role, yourScore) {
      this.role = role;
      this.yourScore = yourScore;
    },

    switchRole() {
      this.role = this.role=='shoot' ? 'defend' : 'shoot' ;
      this.selected = false;
    },

    saveResult(round, shoots, result) {
      this.score[`p${shoots + 1}`][round] = result;
      console.log(this.score.p1, this.score.p2);
    },
    start() {
      this.score.forEach(el => {
        el = [];
        for (var i=0; i<5; i++)
          el.push(null);
      })
    },
    join() {
      this.status = 'queue';
      Socket.emit('join');
    }
  }
})

Socket.on('start', () => {
  App.status = 'game';
})

Socket.on('settings', ({role, yourScore}) => {
  App.set(role, yourScore);
})

Socket.on('shoot', (n) => {
  App.active = n;
  App.shootTime = Date.now();
  setTimeout(() => {App.active = null}, 450);
})

Socket.on('result', ({round, shoots, result}) => {
  console.log(round, shoots, result);
  App.saveResult(round, shoots, result);
})

Socket.on('switchRole', () => {
  App.switchRole();
})

Socket.on('end', (end) => {
	App.status = 'end';
	App.score = end;
})
