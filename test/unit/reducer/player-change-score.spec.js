"use strict";

var _ = require("lodash");
var fixtures = require("../../fixture/player-score");
var reduce = require("app/reducer/player-change-score");
var sinon = require("sinon");
var test = require("tape");
var update = require("react-addons-update");
var upperCaseKeys = require("app/util/upper-case-keys");

var baseState = {
  score: null,
};

var baseAction = {
  type: "PLAYER_CHANGE_SCORE",
  payload: {
    score: "1234.5678",
  },
};

var actionTypes = {
  SANITIZE_SCORE: {
    payload: {
      score: baseAction.payload.score,
    },

    return: 1234,
  },
};

function subReduce (state, action) {
  return actionTypes[action.type].return;
}

var spy = subReduce = sinon.spy(subReduce);

reduce = reduce.factory({
  getReducer: () => subReduce,
});

var suiteDesc = "reducer/player-change-score : ";

test(suiteDesc + "Correctly invokes sub reducer(s)", function (t) {
  spy.reset();

  function makeAction (payload) {
    return update(baseAction, {
      payload: payload,
    });
  }

  var newState = reduce(baseState, makeAction({
    score: {$set: actionTypes.SANITIZE_SCORE.return},
  }));

  t.equal(
    spy.callCount,
    Object.keys(actionTypes).length,
    "Sub reducer called correct number of times"
  );

  Object.keys(actionTypes).forEach(function (type, i) {
    var action = spy.args[i][1];
    t.equal(action.type, type, "Correct action.type");
  });

  t.end();
});

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
    actionTypes.SANITIZE_SCORE.return,
    "State has correct score"
  );

  t.end();
});
