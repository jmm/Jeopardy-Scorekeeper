import _ from 'underscore';
import View from 'app/view/view';
import Model from 'app/model/model';
import Board from 'app/view/board';
import Cfg from 'app/view/cfg';
import Players from 'app/view/players';
import View_Collection_Players from 'app/view/collection/players';
import handle_open_dialog_request from
  'app/view/game/handle-open-dialog-request';

var Super_Klass = View;

var imports = {
  View,
  Board,
  Cfg,
  Players,
};

var $ = View.$();

export default Super_Klass.extend({
  template_id: 'game',
  id: "game",

  handle_open_dialog_request,

  events () {
    return {
      "click .add-player a[href]": function (event) {
        event.preventDefault();
        this.model.players.add({});
      },

      "click #start-game": function (event) {
        event.preventDefault();
        var config = this.options.views.cfg.get_cfg();

        // Game config.
        this.model.set(config.config);
        // UI config.
        this.options.config.set(config.ui);
        this.model.start_game();
      }
    };
  },
  // events

  initialize (options) {
    this.listenTo(this.model, 'start_round', this.start_round);

    this.listenTo(
      this.event_publisher,
      'view:open-dialog-request',
      this.handle_open_dialog_request
    );

    this.model.players.views = new View_Collection_Players({
      model: this.model,
    });

    // Store UI config.
    this.options.config = new Model({
      display_clue_counts: true,
    });

    this.options.views = {};
    var self = this;

    // Create child views
    [
      {key: 'cfg', klass: 'Cfg'},
      {key: 'players', klass: 'Players'},
    ].forEach(function (view) {
      create_child_view.call(self, view.key, view.klass);
    });

    this.options.views.dialogs = {};

    this.options.dialog_stack = [];
  },
  // initialize,

  /**
   * Update the UI in response to start of a new round.
   * @param int round New round rumber.
   */
   start_round (round) {
     var
      old_board = this.options.views.board,
      model = this.model.rounds.current().board;

     if (old_board) {
       // This will signal render() to replaceWith().
       old_board.$el.toggleClass('placeholder', true);
     }

     if (model) {
       this.options.views.board = new Board({
         model: model,
         display_clue_counts: this.options.config.get('display_clue_counts'),
       });

       // In this interface clues are promoted to Daily Doubles on the fly, so
       // it's necessary to know how many are coming and decrement the count
       // when they show up. So seed the expected amount.
       model.clue_counts.add({
         value: 'nominal_daily_double',
         count: round.get('number'),
       });
     }

     this.render();
     if (old_board) old_board.close();

     if (round.get('final')) {
       this.handle_open_dialog_request({
         type: 'final_jeopardy',
       });
     }
   },
   // start_round

  /**
   * Get the dialog at the top of the stack.
   *
   * @return obj Dialog view.
   */
  get_current_dialog () {
    return this.options.dialog_stack.slice(-1)[0];
  },
  // get_current_dialog

  /**
   * Open a dialog.
   *
   * @param obj dialog Dialog view.
   * @param obj cell jQuery object containing cell DOM element.
   */
  open_dialog (dialog, cell) {
    // Container for all dialogs.
    var container = this.$el.find("#dialogs");
    var stack = this.options.dialog_stack;

    // If there are already dialogs on the stack, toggle them off.
    if (stack.length) {
     stack.slice(-1)[0].toggle(false);
    }
    // if

    // If there are no dialogs on the stack, the dialogs container needs to be
    // enabled.
    else {
      container.toggleClass("enabled", true);
    }
    // else

    stack.push(dialog);

    this.listenToOnce(dialog, 'close', () => {
      this.close_dialogs(1);
    });

    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    // if

    // Disable the board.
    if (this.options.views.board) this.options.views.board.toggle(false);
    container.append(dialog.el);
    dialog.open();
    this.position_dialog(dialog, cell);
  },
  // open_dialog

  /**
   * Close some or all dialogs.
   *
   * @param int count Number of dialogs to close. -1 for all.
   */
  close_dialogs (count) {
    var dialog;

    count = count == -1 ? this.options.dialog_stack.length : count;

    while (count && this.options.dialog_stack.length) {
      dialog = this.options.dialog_stack.pop();
      dialog.close({cache: true});
      --count;
    }
    // while

    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    // if

    // If there are still dialogs on the stack, enable the top one.
    if (dialog = this.get_current_dialog()) {
      dialog.toggle(true);
      dialog.$el.focus()
    }
    // if

    // There are no dialogs on the stack, so disable the dialogs container and
    // enable the board.
    else {
      $("#dialogs").toggleClass('enabled', false);

      if (this.options.views.board) {
        this.options.views.board.toggle(true);
        this.options.views.board.focus_default_cell();
      }
    }
    // else
  },
  // close_dialogs

  /**
   * Position a dialog.
   *
   * @param obj dialog Dialog view.
   * @param obj current_cell jQuery object containing cell DOM object.
   */
  position_dialog (dialog, current_cell) {
    var game_ui = this.$el;

    var pos = {top: null, left: null};

    // Store some reference points to use in calculating the dialog position.
    // `multiple` is used to determine which direction to shift the dialog in.
    var pos_refs = {
      // Horizontal
      h: {ref: game_ui.outerWidth(true), multiple: 1},

      // Vertical
      v: {ref: $(window).height(), multiple: -1},

      // Point of reference for values of dialog `top`. E.g. this sometimes
      // needs to be subtracted from the new value of dialog `top` to position
      // the dialog correctly with respect to the viewport.
      top: null
    };

    // E.g. if it's a clue dialog, in which case position it as close to the
    // corresponding cell as possible.
    if (current_cell) {
      // Position the dialog top at cell top and prepare to shift it up.
      pos.top = current_cell.position().top;
      pos_refs.v.ref = current_cell.outerHeight(true);
      pos_refs.v.multiple = -1;

      // Position the dialog at cell left and prepare to shift left.
      pos.left = current_cell.position().left;
      pos_refs.h.ref = current_cell.outerWidth(true);
      pos_refs.h.multiple = -1;

      pos_refs.top = this.options.views.board.$el.offset().top;
    }
    // if

    else {
      pos_refs.top = game_ui.offset().top;
    }

    if (
      pos.top !== null ||
      $(window).height() < dialog.$el.outerHeight(true) ||
      $(window).scrollTop() ||
      dialog.$el.attr('id') == "dialog-final-jeopardy"
    ) {
      pos.top = Number(pos.top);
      if (! pos.top) {
        pos.top += $(window).scrollTop() - pos_refs.top;
      }
      // if

      pos.top += (
        ((dialog.$el.outerHeight(true) - pos_refs.v.ref) / 2) *
        pos_refs.v.multiple
      );
    }
    // if

    var bottom = pos_refs.top + Number(pos.top) + dialog.$el.outerHeight(true);

    if (($(window).height() + $(window).scrollTop()) < bottom) {
      pos.top = (
        Number(pos.top) - (
          bottom -
          ($(window).height() + $(window).scrollTop())
        )
      );
    }
    // if

    if (pos.top !== null) {
      pos.top = Math.max(pos.top, ($(window).scrollTop() - pos_refs.top));
    }
    // if

    if ($(window).width() < game_ui.outerWidth(true)) {
      pos.left = $(window).scrollLeft();
      pos_refs.h.multiple = 1;
      pos_refs.h.ref = $(window).width();

      if ($(window).width() < dialog.$el.outerWidth(true)) {
        pos_refs.h.multiple = -1;
      }
      // if
    }
    // if

    pos.left = Number(pos.left) + (
      (Math.abs(dialog.$el.outerWidth(true) - pos_refs.h.ref) / 2) *
      pos_refs.h.multiple
    );

    dialog.$el.css(pos);
  },
  // position_dialog

  /**
   * Render HTML string representing view.
   *
   * @param obj data Data to populate view with.
   * @return string Rendered view.
   */
  render_string (data) {
    var view;
    data = data || {};
    var output = this.render_template(this.template_id, data);
    return output;
  },
  // render_string

  render () {
    var
      view = this,
      views = this.options.views,
      child,
      data = {},
      current_round = this.model.rounds.current();

    if (current_round) {
      data.current_round = current_round.get('number');
      data.round_label = current_round.get_display_name();
    }

    // The view hasn't been rendered previously.
    if (! this.rendered) {
      var output = $(this.render_string(data));

      this.rendered = true;
      this.$el.empty().append(output.children());
    }
    // if

    // The view has been rendered before.
    else {
      this.$el.find("#section-round .primary-section-heading")
        .text(data.round_label);
    }
    // else

    // The game is in progress.
    if (data.current_round > 0) {
      this.$el.find(".add-player").toggleClass('enabled', false);
    }

    // Render child views.
    ['cfg', 'board', 'players'].forEach((child) => {
      // Close the board if it's the Final Jeopardy round.
      if (child == 'board') {
        if (current_round) {
          // No board, no board UI.
          if (! current_round.board) {
            if (views[child]) return views[child].close();
          }
        }
        // No board yet at round 0. Bail out before render().
        else return;
      }
      // if

      // Replace .view.placeholder element with real view. Do this before render
      // to allow things like .focus()'ing a child of the view.
      this.$el.find(".view.placeholder#" + child).replaceWith(views[child].el);

      views[child].render();
    });

    return this;
  }
  // render
});

/**
 * Create a child view.
 */
function create_child_view (key, Klass) {
  var options = {};

  switch (key) {
    case 'players':
      _.extend(options, {
        collection: this.model.players,
      });
    break;

    case 'cfg':
      _.extend(options, {
        model: this.model,
      });
    break;
  }

  return this.options.views[key] = new (imports[Klass])(options);
}
// create_child_view
