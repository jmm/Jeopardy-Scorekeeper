import Model from 'jeopardy/lib/model/player';
import Collection from 'jeopardy/lib/collection/collection';
var Super_Klass = Collection;

var Klass = Super_Klass.extend({
  model: Model,

  initialize (opts) {
    this.on('remove destroy', function (player) {
      this.next();
    }, this);

    this.on('add', function (player) {
      if (player.get('has_control')) this.set_current(player);
    }, this);
  },
  // initialize

  next (opts = {}) {
    if (this.length === 1 && this.current()) return;

    // User can specify a player that should be considered "current" for
    // purposes of selecting the next.
    var current = opts.current || this.current();

    // Duck type for Model.
    if (! (current && current.get)) {
      current = this.get(current);
    }
    current = this.indexOf(current);

    var next = current != null ? current + 1 : 0;
    if (! (next >= 0 && next < this.length)) next = 0;

    next = this.at(next);
    this.set_current(next);
    return next;
  },
  // next

  current () {
    return this.findWhere({has_control: true});
  },
  // current

  /**
   * Assign control of the board to a specified player.
   * @param number after Player model or id to whom to assign control.
   */
  set_current (after) {
    var before = this.current();
    after = typeof after === Number ? this.get(after) : after;

    if (before) {
      if (before === after) return;
      before.set('has_control', false);
    }
    // if

    if (after) {
      after.set('has_control', true);
    }

    this.trigger('change_current', after);
  },
  // set_current
});

export default Klass;
