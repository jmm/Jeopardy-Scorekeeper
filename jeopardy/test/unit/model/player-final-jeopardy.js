var
  assert = require("assert"),
  Player_Final = require('jeopardy/lib/model/player-final-jeopardy').default,
  context;

describe("Model : Final Jeopardy Player", function () {
  beforeEach(function () {
    context = {
      score: 400,
      wager: 300,
    };

    context.player = new Player_Final;
  });
  // beforeEach

  // Parent class' overridden by its own.
  describe("has correct default attributes", function () {
    var score = 100;
    var attrs = {
      name: "",
      score: 0,
      original_score: null,
      working_score: null,
      has_control: false,
      live: true,
      wager: null,
    };

    function check_attrs (expected) {
      Object.keys(attrs).forEach(function (key) {
        var vals = {
          expected: attrs[key],
          actual: context.player.get(key),
        };

        assert(
          vals.actual === vals.expected,
          key + ' has wrong default: ' + vals.actual + ' !== ' + vals.expected
        );
      });
    }

    it("without score set", function () {
      check_attrs(attrs);
    });
    // it

    it("with score set", function () {
      var score = 123;
      context.player = new Player_Final({score: score});
      attrs.score =
        attrs.original_score =
        attrs.working_score =
        score;

      check_attrs(attrs);
    });
    // it
  });
  // describe
});
// describe
