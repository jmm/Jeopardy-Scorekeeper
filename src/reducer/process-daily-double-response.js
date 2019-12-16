"use strict";

var update = require("react-addons-update");

const {
  reducer: normalize_daily_double_wager,
} = require("app/reducer/normalize-daily-double-wager");

const {
  reducer: process_clue_response,
} = require("app/reducer/process-clue-response");

function process_daily_double_response (state, action) {
  var wager = normalize_daily_double_wager(action.payload.wager, {
    type: "NORMALIZE_DAILY_DOUBLE_WAGER",
    payload: {
      min_daily_double_wager: state.min_daily_double_wager,
      max_clue_value: state.rounds.slice(-1)[0].max_clue_value,
      score: state.players[action.payload.playerId].score,
      correct: action.payload.responseType !== "wrong",
      deduct_incorrect_daily_double: state.deduct_incorrect_daily_double,
    }
  });

  return process_clue_response(state, update(action, {
    type: {$set: "PROCESS_CLUE_RESPONSE"},
    payload: {
      clue: {
        value: {$set: wager}
      },
      dailyDouble: {$set: true},
    }
  }));
}

module.exports = {reducer: process_daily_double_response};
