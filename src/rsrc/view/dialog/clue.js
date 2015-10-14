import _ from 'underscore';
import View from "app/view/view";
import Dialog from "app/view/dialog/dialog";

var $ = View.$();
var Super_Klass = Dialog;

/**
 * Clue Dialog.
 * Model for this view is Clue.
 */
export default Super_Klass.extend({
  tagName: "div",
  className: "dialog",
  id: "dialog-clue",
  template_id: "dialog/clue",
  rendered: false,

  /**
   * Change model.
   * This allows the view to be cached and mostly reused without re-rendering.
   */
  set_model (model) {
    if (this.model) this.stopListening(this.model.clue);
    if (model) {
      this.listenTo(model.clue, 'close', this.close_clue);
    }
    this.model = model;
  },
  // set_model

  events () {
    return _.extend(_(Super_Klass.prototype).result('events'), {
      "click button.right, button.wrong": 'finish_clue',
      "click button.skip": 'finish_clue',
      "click button.cancel": 'cancel_clue',
      "click button.daily-double": 'start_daily_double'
    });
  },
  // events

  /**
   * Start a daily double.
   * @param obj event.
   */
  start_daily_double (event) {
    event.preventDefault();

    this.model.clue.set('daily_double', true);

    this.event_publisher.trigger('view:open-dialog-request', {
      type: 'daily_double',
      view: this,
      model: this.model.clue,
      promoted: true,
    });
  },
  // start_daily_double

  /**
   * Close the current clue.
   * @param obj event
   */
  close_clue () {
    this.set_model(null);
    this.close({cache: true});
  },
  // close_clue

  /**
   * Finish the current clue.
   * @param obj event
   */
  finish_clue (event) {
    event.preventDefault();

    // Default to skip.
    var correct = null;

    if ($(event.target).closest("button").hasClass('right')) correct = true;
    else if ($(event.target).closest("button").hasClass('wrong')) {
      correct = false;
    }

    // JMMDEBUG when to close vs. give other players a crack when ! correct?
    this.model.clue.resolve_response({
      player: this.model.players.get(this.model.get('current_player')),
      correct,
      deduct_incorrect: this.model.get('deduct_incorrect'),
    });
  },
  // finish_clue

  /**
   * Back out of the current clue with no change to counts or scores.
   * @param obj event
   */
  cancel_clue (event) {
    event.preventDefault();
    this.model.clue.cancel();
  },
  // cancel_clue

  render () {
    var data = {
      clue_value: this.model.clue.get('value'),
      daily_doubles_live: this.model.get('daily_doubles_live'),
    };
    var output = $(this.render_template(this.template_id, data));
    this.$el.html(output.html());

    return this;
  }
  // render
});
