"use strict";

var _ = require("lodash");
var assign = Object.assign;
var reduce = require("app/reducer/process-daily-double-response");
var sinon = require("sinon");
var test = require("tape");
var update = require("react-addons-update");
var upperCaseKeys = require("app/util/upper-case-keys");

var baseState = {
  min_daily_double_wager: 5,
  deduct_incorrect_daily_double: true,
  rounds: [
    {
      max_clue_value: 1000,
      board: [[{}]],
    }
  ],
  players: [
    {
      score: 2000,
    }
  ],
};

var baseAction = {
  type: "PROCESS_DAILY_DOUBLE_RESPONSE",
  payload: {
    wager: 2222,
    playerId: 0,
    responseType: "right",
    clue: {
      value: null,
    }
  },
};

var actionTypes = {
  NORMALIZE_DAILY_DOUBLE_WAGER: {
    payload: {
      min_daily_double_wager: baseState.min_daily_double_wager,
      max_clue_value: baseState.rounds.slice(-1)[0].max_clue_value,
      score: baseState.players[baseAction.payload.playerId].score,
      correct: baseAction.payload.responseType !== "wrong",
      deduct_incorrect_daily_double: baseState.deduct_incorrect_daily_double,
    },
  },
  PROCESS_CLUE_RESPONSE: {
    payload: update(baseAction.payload, {
      clue: {
        value: {$set: baseAction.payload.wager},
      },
      dailyDouble: {$set: true},
    }),
  },
};

actionTypes.NORMALIZE_DAILY_DOUBLE_WAGER.return = baseAction.payload.wager;

actionTypes.PROCESS_CLUE_RESPONSE.return = update(baseState, {
  players: {
    0: {
      score: {$set:
        actionTypes.NORMALIZE_DAILY_DOUBLE_WAGER.return +
        baseState.players[0].score
      }
    }
  }
});

function subReduce (state, action) {
  var value = actionTypes[action.type].return;
  if (value) return value;
  return state;
}

var spy = subReduce = sinon.spy(subReduce);

reduce = reduce.factory({
  getReducer: () => subReduce,
});

var suiteDesc = "reducer/process-daily-double-response : ";

test(suiteDesc + "Correctly invokes sub reducer(s)", function (t) {
  spy.reset();

  function makeAction (payload) {
    return update(baseAction, {
      payload: payload,
    });
  }

  var newState = reduce(baseState, makeAction({}));

  t.equal(
    spy.callCount,
    Object.keys(actionTypes).length,
    "Sub reducer called correct number of times"
  );

  Object.keys(actionTypes).forEach(function (type, i) {
    var action = spy.args[i][1];
    t.equal(action.type, type, "Correct action.type");
    t.deepEqual(action.payload, actionTypes[type].payload, "Correct payload");
  });

  t.end();
});

test(suiteDesc + "Returns updated state", function (t) {
  // In other words, test that it allows a true daily double when the wager is
  // higher than the maximum regular clue value for the round.

  function makeAction (wager) {
    return update(baseAction, {
      payload: {
        wager: {$set: wager}
      }
    });
  }

  var state = reduce(baseState, makeAction(baseState.players[0].score));

  t.equal(
    state.players[0].score,
    actionTypes.PROCESS_CLUE_RESPONSE.return.players[0].score,
    "Returns state with new score"
  );
  t.end();
});
