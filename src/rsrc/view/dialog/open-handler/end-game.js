import Dialog from 'app/view/dialog/end-game';

export default function ({dialog, options = {}}) {
  options.model = this.model;

  dialog = new Dialog(options);

  dialog.render();

  return dialog;
}
