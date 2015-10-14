import _ from 'underscore';
import game_defaults from 'jeopardy/lib/model/game-default-attrs';
import Model from 'jeopardy/lib/model/model';
import Clues from 'jeopardy/lib/collection/clues';
var Super_Klass = Model;

export default Super_Klass.extend({
  defaults () {
    return {
      index: null,
      name: "",

      // Pseudo attrs
      clues: null,
    };
  },
  // defaults

  initialize (attrs, opts) {
    opts = opts || {};

    this.process_pseudo_attrs();

    this.listenTo(
      this.clues,
      'add change:enabled change:daily_double',
      change_clue_count
    );

    if (! this.clues.length) {
      for (
        let
          i = 1,
          j = this.num_clues;
        i <= j;
        ++i
      ) {
        this.clues.push({value: this.increment * i});
      }
    }

    function change_clue_count (clue) {
      this.trigger('change:clues', this, clue);
    }
  },
  // initialize

  parse (attrs, opts) {
    this.process_pseudo_attrs(null, attrs);

    return _.omit(attrs, Object.keys(this.pseudo_attrs));
  },
  // parse

  pseudo_attrs: {
    clues: Super_Klass.prototype.pseudo_attr_maker(Clues),
    num_clues: true,
    increment: true,
  },

  num_clues: game_defaults.category_length,
});
