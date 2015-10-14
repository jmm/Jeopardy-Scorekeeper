import Model from 'jeopardy/lib/model/model';
import Collection from 'jeopardy/lib/collection/collection';
var Super_Klass = Model;

var Klass = Super_Klass.extend({
  defaults () {
    return {
      daily_double: false,
      // "Live" or not.
      enabled: true,
      // Currently in play.
      open: false,
    };
  },
  // defaults

  initialize (attrs = {}, opts = {}) {
    // Players who've responded to the clue.
    this.players = new Collection(null, {
      model: Model,
    });
  },
  // initialize

  /**
   * Trigger the same event (with different names) here & on this.event_publisher.
   */
  _double_tap (event, ...params) {
    params.unshift(event, this);
    this.trigger(...params);
    params[0] = `clue:${params[0]}`;
    this.event_publisher.trigger(...params);
  },

  /**
   * Select the clue from the board.
   * @param object opts Options hash.
   */
  open (opts = {}) {
    this.set('open', true);
    this._double_tap('open', opts);
  },

  /**
   * Cancel play, reverting to original conditions.
   */
  cancel () {
    this.close();
    this._double_tap('cancel');
  },

  /**
   * Discontinue play of the clue.
   */
  close () {
    this.set('open', false);
    this._double_tap('close');
  },

  /**
   * Remove from play.
   * Finishing without processing a player response is equivalent to skipping.
   */
  finish () {
    // Already finished.
    if (! this.get('open')) return;

    this.set('enabled', false);
    this.close();
    this._double_tap('finish_clue');
  },

  /**
   * Resolve a player's response.
   * @param true|false|null opts.correct null indicates skipping.
   */
  resolve_response (opts = {}) {
    var
      player = opts.player;

    if (this.players.get(player.id)) {
      throw new Error("Player has already responded to clue.");
    }

    this.players.push({
      id: player.id,
      correct: opts.correct,
    });

    var
      clue_type = 'clue',
      wager = this.get('value');

    if (this.get('daily_double')) {
      wager = opts.wager;
    }

    if (opts.correct === false) {
      wager *= opts.deduct_incorrect ? -1 : 0;
    }
    // if
    else if (! opts.correct) wager = 0;

    player.update_score(wager);

    this._double_tap('resolve_response', opts);

    if (opts.correct) this.finish();
  },
  // resolve_response
});

export default Klass;
