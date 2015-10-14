var
  assert = require("app/assert"),
  _ = require('underscore'),
  View = require('app/view/players').default,
  Model = require('jeopardy/lib/model/player').default,
  Collection = require('jeopardy/lib/collection/players').default,
  View_Collection = require('app/view/collection/players').default;

describe("View : Players", function () {
  var
    player = new Model({id: '123'}),
    collection = new Collection,
    view_collection = new View_Collection({
      model: {players: collection},
    }),
    view;

  collection.views = view_collection;

  beforeEach(function () {
    sinon.spy(View.prototype, 'render');
    view = new View({
      collection,
    });
  });
  // beforeEach

  afterEach(function () {
    View.prototype.render.restore();
  });
  // afterEach

  it("renders when player added", function () {
    collection.add(player);
    assert(view.render.calledOnce);
    assert(view.$(".player").length === collection.length);
  });
  // it

  it("renders when player removed", function () {
    collection.remove(player);
    assert(view.render.calledOnce);
    assert(view.$(".player").length === collection.length);
  });
  // it
});
// describe
