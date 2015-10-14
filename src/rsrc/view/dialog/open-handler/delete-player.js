import Dialog from 'app/view/dialog/delete-player';

export default function ({dialog, options = {}}) {
  dialog = new Dialog(options);

  dialog.render();

  return dialog;
}
