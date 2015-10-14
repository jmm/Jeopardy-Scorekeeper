import _ from 'underscore';
import Model from 'jeopardy/lib/model/player';
var Super_Klass = Model;

export default Super_Klass.extend({
  defaults () {
    return _.extend({}, _.result(Super_Klass.prototype, 'defaults'), {
      // Player's original score entering Final Jeopardy.
      original_score: null,
      // Base score that wager will be applied to. Initialized to
      // original_Score.
      working_score: null,
      wager: null,
    });
  },
  // defaults

  initialize (attrs = {}, opts = {}) {
    Super_Klass.prototype.initialize.apply(this, arguments);
    // Store player's pre-Final Jeopardy score so that their final score can be
    // recalculated with different wagers until the user is done.
    if (attrs.hasOwnProperty('score')) {
      this.set({
        original_score: attrs.score,
        working_score: attrs.score,
      });
    }
  },
  // initialize
});
