"use strict";

var {reducer: reduce} = require("app/reducer/process-daily-double-response");
var test = require("tape");
var update = require("react-addons-update");

var clue = {
  value: 600,
  enabled: true,
};

var baseState = {
  min_daily_double_wager: 5,
  deduct_incorrect_daily_double: true,
  rounds: [
    {
      max_clue_value: 1000,
      board: [[clue]],
    }
  ],
  players: [
    {
      score: 2000,
    }
  ],

  current_clue: {
    players: [],
  },
};

var baseAction = {
  type: "PROCESS_DAILY_DOUBLE_RESPONSE",
  payload: {
    wager: 2222,
    playerId: 0,
    responseType: "right",
    clue: {
      value: null,
    },
    categoryId: 0,
    id: 0,
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
        baseState.players[0].score * 2,
      }
    }
  }
});

var suiteDesc = "reducer/process-daily-double-response : ";

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
