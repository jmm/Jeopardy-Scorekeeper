"use strict";

var update = require("react-addons-update");

exports.factory = factory;

function factory (opts) {
  function process_daily_double_response (state, action) {
    var wager = opts.getReducer(null)(action.payload.wager, {
      type: "NORMALIZE_DAILY_DOUBLE_WAGER",
      payload: {
        min_daily_double_wager: state.min_daily_double_wager,
        max_clue_value: state.rounds.slice(-1)[0].max_clue_value,
        score: state.players[action.payload.playerId].score,
        correct: action.payload.responseType !== "wrong",
        deduct_incorrect_daily_double: state.deduct_incorrect_daily_double,
      }
    });

    return opts.getReducer()(state, update(action, {
      type: {$set: "PROCESS_CLUE_RESPONSE"},
      payload: {
        clue: {
          value: {$set: wager}
        },
        dailyDouble: {$set: true},
      }
    }));
  }

  process_daily_double_response.factory = factory;

  return process_daily_double_response;
}
