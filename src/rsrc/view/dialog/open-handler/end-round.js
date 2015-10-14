import Dialog from 'app/view/dialog/end-round';

export default function ({dialog, options = {}}) {
  options.model = this.model.rounds.current();

  dialog = new Dialog(options);

  dialog.render();

  return dialog;
}
