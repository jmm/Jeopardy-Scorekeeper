import _ from 'underscore';
import default_attrs from 'jeopardy/lib/model/game-default-attrs';
import Model from 'jeopardy/lib/model/model';
import Players from 'jeopardy/lib/collection/players';
import Rounds from 'jeopardy/lib/collection/rounds';
import Final_Jeopardy from 'jeopardy/lib/model/final-jeopardy';
var Super_Klass = Model;

export default Super_Klass.extend({
  // Default klasses for member objects.
  klasses: {
    Model,
    Players,
  },

  /// array Maps round numbers to names.
  round_names: [
    "Single",
    "Double",
    "Final",
  ],

  defaults,

  initialize (attrs = {}, opts = {}) {
    if (opts.klasses) this.klasses = _.extend({}, this.klasses, opts.klasses);
    this.process_pseudo_attrs();
    this.players.game = this;

    this.rounds = new Rounds;

    this.listenTo(this.rounds, 'end', this.end_round);

    this.listenTo(this.event_publisher, 'clue:open', this.handle_clue_open);
    this.listenTo(this.event_publisher, 'clue:close', this.handle_clue_close);
    this.listenTo(this.event_publisher, 'clue:cancel', this.handle_clue_cancel);

    this.listenTo(
      this.event_publisher,
      'clue:resolve_response',
      this.handle_clue_resolve_response
    );
  },
  // initialize

  parse (attrs, opts) {
    this.process_pseudo_attrs(null, attrs);

    return _.omit(attrs, Object.keys(this.pseudo_attrs));
  },
  // parse

  pseudo_attrs: {
    players (data) {
      return this.pseudo_attr_make(data, this.klasses.Players);
    },
  },

  /**
   * Handle event publisher `clue:open` events.
   */
  handle_clue_open (clue) {
    // Flags that the game is in the open clue state.
    this._current_clue = clue;
    // Remember which player had control of the board when the clue started.
    this._clue_open_player = this.players.current();
  },
  // handle_clue_open

  /**
   * Handle event publisher `clue:close` events.
   */
  handle_clue_close () {
    this._current_clue = null;
  },
  // handle_clue_close

  /**
   * Handle event publisher `clue:cancel` events.
   */
  handle_clue_cancel () {
    this.players.set_current(this._clue_open_player);
    this._clue_open_player = null;
  },
  // handle_clue_cancel

  /**
   * Handle event publisher `clue:resolve_response` events.
   */
  handle_clue_resolve_response (clue, opts) {
    // Clue isn't in play, or all players have had a crack at it.
    if (
      ! clue.get('open') ||
      clue.players.length === this.players.length
    ) {
      clue.finish();
      if (! opts.correct) this.players.next();
    }

    if (opts.correct) this.players.set_current(opts.player);

    // JMMDEBUG For now just consider the clue finished on wrong response. As
    // part of general solution to regular / DVR rules, this needs to change to
    // allow other users to have a crack at the clue.
    clue.finish();

    // JMMDEBUG For now just implement DVR Jeopardy logic. This is a kludge.
    // This class should implement core Jeopardy logic only. Some other layer
    // should implement DVR logic.
    if (! opts.correct) this.players.next();
  },
  // handle_clue_resolve_response

  /**
   * Start the game.
   */
  start_game () {
    if (! this.players.length > 0) {
      throw new Error("Must have 1 or more players.");
    }

    if (! this.players.current()) this.players.next();

    this.init_round(1);
  },
  // start_game

  /**
   * Initialize a round.
   * @param int round New round number.
   */
  init_round (round) {
    var
      final_round = round === this.get('total_rounds'),
      categories;

    if (round > 1 && ! final_round) {
      this._change_round_player();
    }
    // if

    round = this.rounds.add({
      number: round,
      name: this.round_names[round - 1],
      board: {
        min_clue_value: this.get('min_clue_value') * (final_round ? 0 : round),
        num_categories: final_round ? 1 : this.get('num_categories'),
        category_length: final_round ? 1 : this.get('category_length'),
        categories,
      },
      final: final_round,
    });

    if (final_round) {
      this._current_clue =
        this.rounds.current().board.categories.at(0).clues.at(0);

      this._current_clue.open();

      this._final_jeopardy = new Final_Jeopardy({
        players: this.players,
        num_tv_players: this.get('num_tv_players'),
      });
    }

    this.trigger('start_round', round);
  },
  // init_round

  /**
   * (Possibly) change which player will have control to begin the round.
   */
  _change_round_player () {
    if (
      this.players.length > 1 &&
      this.get('change_round_player_method')
    ) {
      var change_method = this.get('change_round_player_method');
      var rev_player_order = this.players.slice(0).reverse();
      var matching_player = rev_player_order[0];
      var current_player;

      rev_player_order.forEach((player) => {
        current_player = player;

        if (
          (
            change_method === 'min'
            && current_player.get('score') <= matching_player.get('score')
          ) ||

          (
            change_method === 'max' &&
            current_player.get('score') >= matching_player.get('score')
          )
        ) {
          matching_player = current_player;
        }
        // if
      });

      this.players.set_current(matching_player);
    }
    // if
  },
  // _change_round_player

  /**
   * End the current round.
   */
  end_round () {
    this.init_round(this.rounds.current().get('number') + 1);
  },
  // end_round

  /**
   * End self. Seriously can't take another Shakespeare, bible, or poetry clue.
   */
  end () {
    this.event_publisher.trigger('end-game');
  },
  // end_game

  /**
   * Return the Final Jeopardy model.
   */
  get_final_jeopardy () {
    return this._final_jeopardy;
  },
  // get_final_jeopardy
});

/**
 * Return default attrs.
 */
function defaults () {
  return _.clone(default_attrs);
};
// defaults
