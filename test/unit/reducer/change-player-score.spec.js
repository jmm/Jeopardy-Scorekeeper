"use strict";

var _ = require("lodash");
var fixtures = require("../../fixture/player-score");
var reduce = require("app/reducer/change-player-score").reducer;
var sinon = require("sinon");
var test = require("tape");
var update = require("react-addons-update");

var spiedReduce = sinon.spy(reduce);

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
      spiedReduce.reset();
      var state = spiedReduce(baseState, makeAction(spec.actual));

      t.equal(state.players[0].score, spec.expected, "Correct score state");

      t.end();
    });
  });
})(suiteDesc.performCorrect + " : ");
