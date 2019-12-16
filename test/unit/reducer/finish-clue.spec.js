"use strict";

const {assign} = Object;
var reduce = require("app/reducer/finish-clue").reducer;
var test = require("tape");
var update = require("react-addons-update");

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

var suiteDesc = "reducer/finish-clue : ";

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
