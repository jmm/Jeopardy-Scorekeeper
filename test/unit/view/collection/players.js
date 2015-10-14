var
  assert = require("app/assert"),
  _ = require('underscore'),
  Model = require('jeopardy/lib/model/player').default,
  Players = require('jeopardy/lib/collection/players').default,
  View_Collection = require('app/view/collection/players').default;

describe("View : Collection : Players", function () {
  var
    player = new Model({id: '123'}),
    view_collection,
    players;

  beforeEach(function () {
    players = new Players;
    view_collection = new View_Collection({
      model: {players: players},
    });

    players.views = view_collection;
    players.add(player);
  });
  // beforeEach

  it("creates views for initial models", function () {
    players = new Players(player.clone());
    players.views = new View_Collection({
      model: {players: players},
    });
    players.each(function (player) {
      assert(players.views.get_view(player));
    });
  });
  // it

  it("creates view when player added", function () {
    assert(players.views.get_view(player));
  });
  // it

  it("closes view when player removed", function () {
    var view = players.views.get_view(player);
    sinon.spy(view, 'close');
    players.remove(player);
    assert(view.close.calledOnce);
    assert(players.length === 0);
  });
  // it
});
// describe
