import _ from 'underscore';
import View from 'app/view/view';

var $ = View.$();
var Super_Klass = View;

export default Super_Klass.extend({
  tagName: 'tr',
  className: 'player',
  template_id: 'player-final-jeopardy',

  attributes () {
    var attrs = {
      id: "player-" + this.model.cid,
      class: this.className,
    };

    attrs.class += this.model.get('live') ? ' live' : ' tv';

    // See:
    // https://github.com/jashkenas/backbone/pull/3361
    this.className = undefined;

    return attrs;
  },
  // attributes

  initialize (options) {
    this.listenTo(this.model, 'change', this.render);
  },
  // initialize

  /**
   * Process player's response.
   *
   * @return object Return self.
   */
  process_response () {
    var input = {
      correct: Boolean(
        this.$el.find(".correct input:checked").val()
      ),
      // Read this in case the user edits it on the fly.
      working_score:
        this.model.sanitize_score(this.$el.find(".score.before input").val()),
      wager: this.model.sanitize_score(this.$el.find(".wager input").val()),
    };

    this.model.set(input, {silent: true});
  },
  // process_response

  /**
   * Render HTML string representing view.
   *
   * @param obj data Data to populate view with.
   * @return string String rendering of view.
   */
  render_string (data) {
    var output;
    output = this.render_template(this.template_id, data);

    return output;
  },
  // render_string

  render () {
    var data = _.extend(
      this.model.toJSON(),
      {
        name: this.model.get_display_name(),
      }
    );

    var output = $(this.render_string(data));
    this.$el.empty().append(output.children());

    return this;
  },
  // render
});
