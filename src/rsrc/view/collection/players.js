import _ from 'underscore';
import View from 'app/view/player';

function Klass (opts = {}) {
  this.views = {};

  this.model = opts.model;
  this.collection = this.model.players;
  this.add_views(this.collection);


  this.collection.on('add', this.add_view, this);
  this.collection.on('remove', this.remove_view, this);
  // Should do something to get rid of orphaned views.
  this.collection.on('reset', this.add_views, this);
}

Klass.prototype.constructor = Klass;

Klass.prototype.add_views = function () {
  if (this.collection) {
    this.collection.forEach(player => this.add_view(player));
  }
};
// add_views

/**
 * Ensure that new models have a corresponding view.
 */
Klass.prototype.add_view = function (model) {
  var
    view = model.view || {};
  if (! this.views[model.cid]) {
    if (! (view instanceof View)) {
      view = new View(
        _.extend(view, {
          model: model,
          game: this.model,
        })
      );
    }
    model.view = this.views[model.cid] = view;
  }
};
// add_view

/**
 * Remove a model and view. Same signature as parent class.
 */
Klass.prototype.remove_view = function (model) {
  if (this.views[model.cid]) {
    this.views[model.cid].close();
    delete this.views[model.cid];
  }
};
// remove_view

/**
 * Get the view associated with a model.
 */
Klass.prototype.get_view = function (model) {
  return this.views[(this.collection.get(model) || false).cid];
};
// get_view

export default Klass;
