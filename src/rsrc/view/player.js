import _ from 'underscore';
import View from './view';
var $ = View.$();
var Super_Klass = View;

export default Super_Klass.extend({
  tagName: 'div',
  className: 'player',

  attributes () {
    return {
      id: "player-" + this.model.cid
    };
  },
  // attributes

  template_id: 'player',

  events () {
    return {
      "click .delete a[href]": this.delete_player,
      "click .set-has-control a[href]": this.set_has_control,
      "change input": this.process_update_request,
      "focus input": this.select_input,
    };
  },
  // events

  initialize (options) {
    options = options || {};
    this.listenTo(this.model, 'change', this.render);
    this.game = options.game;
    this.$el.data('view', this);
  },
  // initialize

  /**
   * Delete self.
   * @param obj event
   */
  delete_player (event) {
    event && event.preventDefault();

    this.event_publisher.trigger('view:open-dialog-request', {
      type: 'delete_player',
      model: this.model,
    });
  },
  // delete_player

  select_input (el) {
    el = el.target || el;
    el = el.nodeType || typeof el === 'string' ? this.$(el) : el;
    setTimeout(() => {
      el[0].select();
    }, this.options.select_delay);
  },
  // select_input

  select_name () {
    this.select_input("input.name");
  },
  // select_name

  /**
  * Give control of the board to the selected player
  *   (determined by event target).
  * @param obj event
  */
  set_has_control (event) {
    event && event.preventDefault();
    this.model.set_has_control(true);
  },
  // set_has_control

  /**
   * Process a request to update player data manually initiated by the user from
   *   the player forms.
   * @param obj event
   */
  process_update_request (event) {
    var property = event.target.name.match(/\[([^\]]+)\]$/)[1];
    var value = $(event.target).val();

    if (property === 'score') {
      this.model.set_score(value);
    }
    // if

    else {
      this.model.set(property, value);
    }
    // else
  },
  // process_update_request

  /**
   * Render HTML string representing view.
   *
   * @param obj data Data to populate view with.
   * @return string String rendering of view.
   */
  render_string (data) {
    var output;

    data = _.defaults(data, this.model.toJSON());
    output = this.render_template(this.template_id, data);

    return output;
  },
  // render_string

  render () {
    var data = {};

    data = this.model.toJSON();
    data.name = this.model.get_display_name();
    data.class_name = 'has_control';
    data.has_control = this.model.get(data.class_name);
    data[ data.class_name + "_class" ] =
      data.has_control ? data.class_name : "";

    var output = $(this.render_string(data));

    this.$el.empty().append(output.children());
    this.$el.toggleClass('has-control', data.has_control);

    data.game_started =
      this.game &&
      this.game.rounds &&
      !! this.game.rounds.current();

    // Enable / disable player admin links depending on game state.
    this.$el.find(".delete").toggleClass("enabled", ! data.game_started);
    this.$el.find(".set-has-control").toggleClass("enabled", true);

    return this;
  },
  // render
});
