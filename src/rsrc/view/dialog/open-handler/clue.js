import Model from 'app/model/model';
import Dialog from 'app/view/dialog/clue';
import Daily_Double from 'app/view/dialog/open-handler/daily-double';

export default function ({dialog, options = {}}) {
  if (options.model.get('daily_double')) {
    return Daily_Double({dialog, options});
  }

  var attrs = {
    current_player: this.model.players.current().id,
    deduct_incorrect: this.model.get('deduct_incorrect_clue'),

    // Daily doubles remain?
    daily_doubles_live:
      !! this.model.rounds.current().board.clue_counts.findWhere({
        value: 'nominal_daily_double',
      }).get('count'),
  };

  var model = new Model(attrs);

  model.players = this.model.players;
  model.clue = options.model;

  dialog = dialog || new Dialog(options);
  model.clue.open();
  dialog.set_model(model);

  dialog.render();

  return dialog;
};
