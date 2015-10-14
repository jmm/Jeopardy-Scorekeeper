import game_defaults from 'jeopardy/lib/model/game-default-attrs';
import Model from 'jeopardy/lib/model/model';
import Board from 'jeopardy/lib/model/board';
var Super_Klass = Model;

var Klass = Super_Klass.extend({
  initialize (attrs = {}, opts = {}) {
    this.process_pseudo_attrs();

    // Forward event.
    var event = 'change:categories:clues';
    this.listenTo(this.board, event, (...args) => {
      this.trigger(event, ...args);
    });
  },
  // initialize

  parse (attrs, opts) {
    this.process_pseudo_attrs(null, attrs);

    return _.omit(attrs, Object.keys(this.pseudo_attrs));
  },
  // parse

  pseudo_attrs: {
    board: Super_Klass.prototype.pseudo_attr_maker(Board),
  },

  num_categories: game_defaults.num_categories,

  defaults () {
    return {
      number: null,
      name: "",
    };
  },

  /**
   * Get round name formatted for display.
   */
  get_display_name () {
    return this.get('name') ? `${this.get('name')} Jeopardy` : "";
  },

  /**
   * End self. Not as bleak as it sounds.
   */
  end () {
    this.trigger('end', this);
  },
  // end
});

export default Klass;
