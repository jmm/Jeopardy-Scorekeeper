"use strict";

var reduce = require("app/reducer/player-change-score").reducer;
var test = require("tape");
var update = require("react-addons-update");

var baseState = {
  score: null,
};

var baseAction = {
  type: "PLAYER_CHANGE_SCORE",
  payload: {
    score: "1234.5678",
  },
};

const expectedValues = {
  score: 1234,
};

var suiteDesc = "reducer/player-change-score : ";

test(suiteDesc + "Returns updated state", function (t) {
  function makeAction (score) {
    return update(baseAction, {
      payload: {
        score: {$set: score}
      }
    });
  }

  var state = reduce(baseState, makeAction(baseAction.payload.score));

  t.notEqual(state, baseState, "State has changed");
  t.equal(
    state.score,
    expectedValues.score,
    "State has correct score"
  );

  t.end();
});
