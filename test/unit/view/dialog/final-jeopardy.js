var
  assert = require("app/assert"),
  Players = require('jeopardy/lib/collection/players').default,
  Model = require('jeopardy/lib/model/final-jeopardy').default,
  Final_Jeopardy = require('app/view/dialog/final-jeopardy').default;

describe("View : Dialog : Final Jeopardy", function () {
  var cfg = {
    players: {
      live: [{}],
      tv: Array(5),
    },
  };

  var model = new Model({
    players: new Players(cfg.players.live),
    num_tv_players: cfg.players.tv.length,
  });

  var view = new Final_Jeopardy({
    model
  });

  it("renders properly", function () {
    assert(view.render() === view);

    // Should all be equal
    assert([
      (cfg.players.live.length + cfg.players.tv.length),
      model.players.length,
      view.$(".players").children().length,
    ].every(function (val, i, arr) {
      return val === arr[0];
    }));
  });
  // it
});
// describe
