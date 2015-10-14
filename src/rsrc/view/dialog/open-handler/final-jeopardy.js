import Dialog from 'app/view/dialog/final-jeopardy';

export default function ({dialog, options = {}}) {
  dialog = new Dialog({
    model: this.model.get_final_jeopardy(),
  });

  dialog.render();

  return dialog;
}
