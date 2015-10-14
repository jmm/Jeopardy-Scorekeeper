import _ from 'underscore';
import Model from 'jeopardy/lib/model/model';
import Player_Final_Jeopardy_Model from 'jeopardy/lib/model/player-final-jeopardy';
var Super_Klass = Model;

export default Super_Klass.extend({
  defaults () {
    return {
      players: null,
      num_tv_players: 0,
    };
  },
  // defaults

  initialize (attrs = {}, opts = {}) {
    // Players participating in Final Jeopardy (live and TV). Initially
    // populated with players who've been participating before Final Jeopardy.
    this.players = attrs.players.clone();
    this.unset('players');
    this.players.model = Player_Final_Jeopardy_Model;

    // Create new Final Jeopardy specific model for each live player.
    this.players.models = this.players.models.map((player) => {
      var original = player;

      player = new Player_Final_Jeopardy_Model(
        _.clone(player.attributes)
      );

      // Reflect score change to original model.
      player.on('change:score', () =>
        original.set('score', player.get('score'))
      , player);

      return player;
    });

    // Create models for TV players.
    for (
      let i = 1;
      i <= this.get('num_tv_players');
      ++i
    ) {
      this.players.add({
        name: "TV Player " + i,
        live: false,
      });
    }
    // for
  },
  // initialize

  /**
   * Update player scores based on data about their response.
   */
  process_responses () {
    this.players.forEach(player => {
      if (player.get('working_score') <= 0) {
        return;
      }
      // if

      var score =
        player.get('working_score') +
        (
          Math.min(
            Math.max(0, player.get('wager')),
            player.get('working_score')
          ) *

          (player.get('correct') ? 1 : -1)
        );

      player.set({score});
    });
  },
  // process_responses
});
