import _ from 'underscore';
import View from 'app/view/view';
import Dialog from 'app/view/dialog/dialog';

var $ = View.$();
var Super_Klass = Dialog;

export default Super_Klass.extend({
  tagName: "div",
  className: "dialog",
  id: "dialog-end-game",
  template_id: "dialog/end-game",
  rendered: false,

  events () {
    return _.extend({}, _(Super_Klass.prototype).result('events'), {
      "click button": "answer_dialog"
    });
  },
  // events

  /**
   * Process user response to prompt.
   *
   * @param obj event
   * @return void
   */
  answer_dialog (event) {
    event.preventDefault();

    this.close({cache: true});

    if ($(event.target).closest("button").hasClass('yes')) {
      this.model.end();
    }
  },
  // answer_dialog

  render () {
    var data = {};

    data.url = document.location.href;
    data.prompt = "Are you sure you want to end the game?";

    var output = $(this.render_template(this.template_id, data));
    this.$el.html(output.html());

    return this;
  },
  // render
});
