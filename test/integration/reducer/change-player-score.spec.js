"use strict";

var _ = require("lodash");
var fixtures = require("./fixture/player-score");
var {reducer} = require("app/reducer/change-player-score");
var test = require("tape");
var update = require("react-addons-update");

var baseState = {
  players: [
    {
      score: null,
    },
  ],
};

var baseAction = {
  type: "CHANGE_PLAYER_SCORE",
  payload: {
    index: 0,
    score: null,
  },
};

test("Normalizes score correctly", function (t) {
  function makeAction (score) {
    return update(baseAction, {
      payload: {
        score: {$set: score}
      }
    });
  }

  fixtures.items.forEach(function (spec) {
    spec = _.zipObject(fixtures.keys, spec);
    t.test("With " + spec.desc + " input", function (t) {
      var state = reducer(baseState, makeAction(spec.actual));

      t.notEqual(state, baseState);
      t.equal(state.players[baseAction.payload.index].score, spec.expected);
      t.end();
    });
  });

  t.end();
});
