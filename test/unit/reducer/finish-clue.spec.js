"use strict";

var _ = require("lodash");
var assign = require("object-assign");
var reduce = require("app/reducer/finish-clue");
var sinon = require("sinon");
var test = require("tape");
var update = require("react-addons-update");
var upperCaseKeys = require("app/util/upper-case-keys");

function getClue (state, clue) {
  return state.rounds.slice(-1)[0].board[clue.categoryId][clue.id];
}

var clueId = {
  categoryId: 0,
  id: 0,
};

var baseState = {
  rounds: [
    {
      board: [
        [{enabled: true}],
      ],

      dailyDoubles: 1,
    },
  ]
};

var baseAction = {
  type: "FINISH_CLUE",
  payload: assign({}, clueId, {
    clue: {},
  }),
};

var reducers = {
  actions: {},
};

reducers.actions.close_clue = function (state, action) {
  state = assign({}, state, {
    current_clue: null,
  });

  return state;
};

upperCaseKeys(reducers.actions);

function subReduce (state, action) {
  return reducers.actions[action.type](state, action);
};

var spy = subReduce = sinon.spy(subReduce);

reduce = reduce.factory({
  getReducer: () => subReduce,
});

var suiteDesc = "reducer/finish-clue : ";

test(suiteDesc + "Makes correct sub reducer calls", function (t) {
  spy.reset();
  var action = baseAction;

  var state = reduce(baseState, action);

  t.notEqual(state, baseState, "Didn't mutate input state");

  t.equal(
    spy.callCount,
    1,
    "Correct call count for sub reducer"
  );

  var subReduceCall = _.zipObject(["state", "action"], spy.args[0]);

  t.equal(
    subReduceCall.action.type,
    "CLOSE_CLUE",
    "Correct action.type for sub reducer call"
  );

  t.end();
});

test(suiteDesc + "Disables clue", function (t) {
  var action = baseAction;

  var state = reduce(baseState, action);

  t.notEqual(state, baseState, "Didn't mutate input state");

  t.equal(
    getClue(state, clueId).enabled,
    false,
    "Clue is disabled"
  );

  t.end();
});

test(suiteDesc + "Decrements daily double count", function (t) {
  var action = update(baseAction, {
    payload: {
      clue: {
        dailyDouble: {$set: true},
      }
    }
  });

  var state = reduce(baseState, action);

  t.notEqual(state, baseState, "Didn't mutate input state");

  t.equal(
    state.rounds[state.rounds.length - 1].dailyDoubles,
    baseState.rounds[baseState.rounds.length - 1].dailyDoubles - 1,
    "Daily double count was decremented"
  );

  t.end();
});
