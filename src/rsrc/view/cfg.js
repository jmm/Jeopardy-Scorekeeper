import View from 'app/view/view';
import End_Round from 'app/view/dialog/end-round';

var Super_Klass = View;

var $ = View.$();

export default Super_Klass.extend({
  tagName: "div",
  className: "column",
  id: "game-controls",
  template_id: 'cfg',
  rendered: false,

  events () {
    return {
      "click button#end-round.enabled": "end_round",
      "click button#end-game": this.end_game,
    };
  },
  // events

  initialize (options) {
    // Re-render when the daily double clue count changes.
    this.listenTo(
      this.model.rounds,
      'change:categories:clues',
      function (clue_counts, category, clue) {
        // Indicates that a Daily Double has been disabled (played). Due to the
        // way Daily Doubles are defined (on the fly) in this UI it only makes
        // sense to render upon decrement.
        if (clue.get('daily_double') && ! clue.get('enabled')) {
          this._daily_doubles_remaining().set(
            'count',
            this._daily_doubles_remaining().get('count') - 1
          );
          this.render();
        }
      }
    );
  },
  // initialize

  _daily_doubles_remaining () {
    var round = this.model.rounds.current();
    if (! (round && round.board)) return;
    return round.board.clue_counts.findWhere({
      value: 'nominal_daily_double',
    });
  },
  // _daily_doubles_remaining

  /**
   * Read configuration settings from UI.
   * @return obj Map of config params.
   */
  get_cfg () {
    // Find all game / UI config inputs.
    var input = this.$el.find("[name]")
      .filter(function (index) {
        return this.name.match(/^(ui_)?config\[/);
      });

    // Store matches from input name to capture config set (game | UI) and param
    // name.
    var
      param,
      view = this,
      config = {};

    input.each(function (index, element) {
      var $el = $(element), val;

      param = /^((?:ui_)?config)\[(.+)\]/.exec(element.name);

      // Init the config set to an empty object if necessary.
      config[param[1]] = config[param[1]] || {};

      val = $el.val();

      if ($el.data('paramType') == 'bool') {
        val = Boolean(Number(val)).valueOf();
      }
      // if

      // Store the param value in the appropriate config set.
      config[param[1]][param[2]] = val;

      // Disable the input so that it will only display the configured value,
      // read-only.
      element.disabled = true;
    });

    return config;
  },
  // get_cfg

  /**
   * End the current round.
   * @param object event
   */
  end_round (event) {
    event.preventDefault();

    // For Final Jeopardy, there's no end round, just end game.
    if (! this.model.rounds.current().board) {
      return;
    }
    // if

    this.event_publisher.trigger(
      'view:open-dialog-request',
      {
        type: 'end_round',
        view: this,
      }
    );
  },
  // end_round

  /**
   * End game event handler.
   * @param object event
   */
  end_game (event) {
    event.preventDefault();

    this.event_publisher.trigger(
      'view:open-dialog-request',
      {
        type: 'end_game',
        view: this,
      }
    );
  },
  // end_game

  /**
   * Render HTML string representing view.
   * @return string HTML representing view.
   */
  render_string () {
    var data = {};
    data.config = this.model.toJSON();

    var output = this.render_template(this.template_id, data);

    return output;
  },
  // render_string

  render () {
    // If the view hasn't been rendered before, get the string rendering.

    if (! this.rendered) {
      var output = $(this.render_string());
      this.$el.html(output.html());
      this.rendered = true;
    }
    // if

    var round = this.model.rounds.current()

    // The game is in progress.
    if (round) {
      // Disable the setup game controls and enable the admin game ones.
      this.$el.find("#setup-game").toggleClass('enabled', false);
      this.$el.find("#admin-game").toggleClass('enabled', true);

      // A Daily Double containing round is in progress.
      if (round.board) {
        // Display daily double count.
        this.$el.find("#daily-doubles-remaining .count").text(
          this._daily_doubles_remaining().get('count')
        );
      }
    }
    // if

    return this;
  },
  // render
});
