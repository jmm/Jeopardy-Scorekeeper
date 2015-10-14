import View from 'app/view/view';
var Super_Klass = View;
var $ = View.$();
/**
 * Container for player views.
 * Model is model/
 */
export default Super_Klass.extend({
  tagName: "form",
  id: "players",
  template_id: 'players',

  initialize () {
    this.listenTo(this.collection, 'add remove', this.render);
  },
  // initialize

  /**
   * Render HTML string representing view.
   *
   * @return string String rendering of view.
   */
  render_string () {
    var output;
    var data = {};
    output = this.render_template(this.template_id, data);
    return output;
  },
  // render_string

  render () {
    if (! this.rendered) {
      var output = $(this.render_string());

      this.$el.html(output.html());

      this.rendered = true;
    }
    // if

    this.$el.children().detach();

    this.collection.forEach(player => {
      var view = this.collection.views.get_view(player.cid);
      if (view) this.$el.append(view.render().el);
    });

    return this;
  },
  // render
});
