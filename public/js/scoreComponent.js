Vue.component('score-panel', {
  props: ['id', 'score'],
  data() {
    return {

    }
  },

  methods: {

  },

  template: `
  <div class="score-panel" :id="id">
  <ul>
     <li v-for="s in score" :class="{'scored': s===true, 'missed': s===false}"></li>
  </ul>
  </div>
  `

})
