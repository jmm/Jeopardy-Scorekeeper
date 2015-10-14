import _ from 'underscore';
import View from 'app/view/view';
import Dialog from 'app/view/dialog/dialog';
import Player_View from 'app/view/player-final-jeopardy';

var $ = View.$();
var Super_Klass = Dialog;

export default Super_Klass.extend({
  tagName: "div",
  className: "dialog",
  id: "dialog-final-jeopardy",
  template_id: "dialog/final-jeopardy",

  events () {
    return _.extend(_(Super_Klass.prototype).result('events'), {
      "click button.close": this.end_game,
      "click button.reset": "handle_reset",
      "click button.finish": "process_final_jeopardy",
      "focusin input[type='text'],input[type='number']": "select_input",
      "focus .correct .right input": "highlight_correct_input",
      "blur .correct .right input": "highlight_correct_input",
    });
  },
  // events

  select_input (event) {
    setTimeout(() => {
      event.target.select();
    }, this.options.select_delay);
  },
  // select_input

  /**
   * Highlight / unhighlight 'correct' checkboxes on focus / blur.
   * @param obj event
   */
  highlight_correct_input (event) {
    var toggle_on = $.inArray(event.type, ['focus', 'focusin']) != -1;

    $(event.target).closest("label").toggleClass('focused', toggle_on);
  },
  // highlight_correct_input

  /**
   * Process the input and generate final scores.
   * @param obj event
   */
  process_final_jeopardy (event) {
    event.preventDefault();

    this.options.players.forEach(function (player) {
      player.process_response();
    });
    this.model.process_responses();
  },
  // process_final_jeopardy

  /**
   * Get the new active element as a result of keyboard navigation.
   *
   * @param obj cfg Keyboard navigation event properties.
   * @return void|obj Void or a DOM element.
   */
  handle_kbd_nav_get_new_el (cfg) {
    var new_active_element;

    // User is attempting to navigate northwest and the event target is the
    // first button
    if (
      (
        cfg.nav_key == 'Up' ||
        (cfg.nav_key == 'Tab' && cfg.event.shiftKey)
      )

      &&

      cfg.current_dialog.find("button").index(cfg.event.target) === 0
    ) {
      new_active_element = cfg.current_dialog.find("tr.player:last");

      // The user is navigating north -- select the score input.
      if (cfg.nav_key == 'Up') {
        new_active_element = new_active_element.find(".score.before input");
      }

      // The user is navigating west -- select the 'correct' input.
      else {
        new_active_element = new_active_element.find(".correct .right input");
      }
    }
    // if

    return new_active_element;
  },
  // handle_kbd_nav_get_new_el

  /**
   * Handle general keyboard navigation input.
   * @param obj event
   */
  handle_kbd_nav (event) {
    var
      // bool .select() the active element.
      select = false;

    // Run the parent class method when the target is a button.
    if ($(event.target).is("button")) {
      Super_Klass.prototype.handle_kbd_nav.apply(this, arguments);
      return;
    }
    // if

    if (this.handle_kbd_nav_keypress(event)) {
      return;
    }
    // if

    var new_active_element;
    var jq_targ = $(event.target);
    var nav_key, nav_keys = this.nav_keys;
    nav_key = nav_keys[event.which];

    var nav_event = {
      Up: {
        key: 'Up',
        dir: 'prev',
        sibling_offset: 1,
        is_arrow: true,
      },

      Down: {
        key: 'Down',
        dir: 'next',
        sibling_offset: 1,
        is_arrow: true,
      },

      Left: {
        key: 'Left',
        dir: 'prev',
        sibling_offset: 0,
        is_arrow: true,
      },

      Right: {
        key: 'Right',
        dir: 'next',
        sibling_offset: 0,
        is_arrow: true,
      },

      Tab: {
        key: 'Tab',
        dir: (event.shiftKey ? 'prev' : 'next'),
        sibling_offset: 0,
        is_arrow: false,
      }
      // Tab
    }[nav_key];

    var sibling, class_names;

    var cfg = {
      event: event,
      nav_key: nav_key,
      nav_event: nav_event,
      current_dialog: this.$el,
      target: jq_targ,
    };

    // One of the configured directional navigation events has occured.
    if (nav_event) {
      if (event.target === this.el) {
        new_active_element = this.$el.find(
          "tr.player.tv:first .score.before input"
        );
      }
      // if

      // North / South navigation within columns.
      if (jq_targ.is('input') && $.inArray(nav_key, ['Up', 'Down']) != -1) {
        class_names = jq_targ.closest("td")[0].className.replace(" ", ".");

        // Navigate to the row for the closest sibling in the indicated
        // direction that isn't disabled.
        sibling = jq_targ.closest("tr")
          [nav_event.dir + "All"](":not(.disabled):first")
          .find("td." + class_names + " input");

        if (select = sibling.length > 0) {
          new_active_element = sibling;
        }

        // Navigate from the last player row to the first button.
        else if (nav_key == 'Down') {
          new_active_element = this.$el.find("button:first");
        }

        else {
          event.preventDefault();
        }
      }
      // if

      // When arrow key input is received and one of the text inputs isn't the
      // target, suppress native behavior like scrolling the viewport.
      else if (nav_event.is_arrow && ! jq_targ.is("input[type='number']")) {
        event.preventDefault();
      }
      // else if

      // Navigate from the first button to the last player row.
      else if (
        nav_key == 'Tab' &&
        nav_event.dir == 'prev' &&
        this.$el.find("button:visible:first")[0] == event.target
      ) {
        new_active_element = this.$el.find("input:last");
      }
      // else if

      // When the last element in a given direction within the dialog is
      // focused, prevent further attempts to navigate in that direction from
      // moving focus out of the dialog.
      else if (
        nav_key == 'Tab' &&
        (
          // Attempt to navigate to next from last button.
          (
            jq_targ.is("button") &&
            ! jq_targ.next("button:visible").length
          )

          ||

          // Attempt to navigate to previous from first player or first enabled
          // player.
          (
            nav_event.dir == 'prev' &&

            (
              this.$el.find("input:first").get(0) == jq_targ[0] ||
              this.$el.find("input:not([tabindex='-1']):first").get(0) ==
                jq_targ[0]
            )
          )
        )
      ) {
        event.preventDefault();
      }
      // else if

      if (new_active_element && new_active_element.length) {
        event.preventDefault();

        // DEBUG jQuery.blur() / focus() dont work properly in 1.4.4.
        // See http://bugs.jquery.com/ticket/7891
        new_active_element[0].focus();
        if (select) {
          new_active_element.select();
        }
      }
    }
    // if

    event.stopPropagation();

  },
  // handle_kbd_nav

  handle_reset (event) {
    event.preventDefault();
    this.model.players.forEach(player => {
      player.set({
        working_score: player.get('original_score'),
        correct: false,
        score: player.get('original_score') || 0,
        wager: null,
      });
    });
    this.render();
  },
  // handle_reset

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

  render () {
    var data = {};

    var output = $(this.render_template(this.template_id, data));
    this.$el.html(output.html());

    this.options.players = this.options.players ||
      this.model.players.map((player) => {
        player = new Player_View({
          model: player,
        });
        return player;
      });

    this.$el.find(".players").append(
      this.options.players.map(player => player.render().el)
    );

    return this;
  },
  // render
});
