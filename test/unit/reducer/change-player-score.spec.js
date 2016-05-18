"use strict";

var _ = require("lodash");
var assign = Object.assign;
var fixtures = require("../../fixture/player-score");
var reduce = require("app/reducer/change-player-score");
var sinon = require("sinon");
var test = require("tape");
var update = require("react-addons-update");
var upperCaseKeys = require("app/util/upper-case-keys");

function player_change_score (state, action) {
  return assign({}, state, action.payload);
}

var spy = player_change_score = sinon.spy(player_change_score);

reduce = reduce.factory({
  getReducer: () => player_change_score,
});

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

var suiteDesc = {
  top: "reducer/change-player-score : ",
}

suiteDesc.performCorrect = suiteDesc.top + "Performs correctly";

// Tests the output and expected calls to sub reducers.
(function performCorrect (suiteDesc) {
  function makeAction (score) {
    return update(baseAction, {
      payload: {
        score: {$set: score}
      }
    });
  }

  fixtures.items.forEach(function (spec) {
    spec = _.zipObject(fixtures.keys, spec);
    test(suiteDesc + "With " + spec.desc + " input", function (t) {
      spy.reset();
      var state = reduce(baseState, makeAction(spec.actual));

      t.equal(spy.callCount, 1, "Correct call count");

      var action = spy.args[0][1];
      t.equal(action.type, "PLAYER_CHANGE_SCORE", "Correct action.type")

      if (Number.isNaN(spec.actual)) {
        t.ok(Number.isNaN(action.payload.score), "isNaN payload");
        t.ok(Number.isNaN(state.players[0].score), "isNaN score state");
      }
      else {
        t.equal(action.payload.score, spec.actual, "Correct payload.score");
        t.equal(state.players[0].score, spec.actual, "Correct score state");
      }

      t.end();
    });
  });
})(suiteDesc.performCorrect + " : ");
