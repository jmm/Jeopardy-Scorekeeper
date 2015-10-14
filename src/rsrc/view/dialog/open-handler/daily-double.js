import Model from 'app/model/model';
import Dialog from 'app/view/dialog/daily-double';

export default function ({dialog, options = {}}) {
  dialog = dialog || new Dialog();

  var model = new Model({
    // Promoted from regular clue on-the-fly?
    promoted: options.promoted,
    current_player: this.model.players.current().id,
    min_daily_double_wager: this.model.get('min_daily_double_wager'),
    max_clue_value: this.model.rounds.current().board.get_max_clue_value(),
    deduct_incorrect:
      this.model.get('deduct_incorrect_daily_double'),
  });
  model.clue = options.model;
  model.players = this.model.players;

  dialog.set_model(model);

  dialog.render();

  return dialog;
}
