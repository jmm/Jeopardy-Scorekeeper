/**
 * Bridge between Game view and handlers for dialogs.
 * Import a handler for each kind of dialog. The export becomes a method on the
 * game view and delegates to the relevant dialog handler.
 */

import clue from 'app/view/dialog/open-handler/clue';
import daily_double from 'app/view/dialog/open-handler/daily-double';
import end_round from 'app/view/dialog/open-handler/end-round';
import final_jeopardy from 'app/view/dialog/open-handler/final-jeopardy';
import end_game from 'app/view/dialog/open-handler/end-game';
import delete_player from 'app/view/dialog/open-handler/delete-player';

var types = {
  clue,
  daily_double,
  end_round,
  final_jeopardy,
  end_game,
  delete_player,
};

export default function (opts = {}) {
  if (! opts.model && opts.view) {
    opts.model = opts.view.model;
  }
  var dialog = this.options.views.dialogs[opts.type];
  this.options.views.dialogs[opts.type] = dialog = types[opts.type].call(this, {
    dialog,
    options: opts,
  });
  this.open_dialog(dialog, opts.cell)
}
