"use strict";

var assign = require("object-assign");
var reducerUtil = require("app/reducer-util");
var update = require("react-addons-update");
var upperCaseKeys = require("app/util/upper-case-keys");

exports.factory = factory;

function factory (opts) {
  function process_clue_response (state, action) {
    // payload.clue can override `value|dailyDouble`.
    var clue = assign(
      {},
      state.rounds.slice(-1)[0].board
        [action.payload.categoryId]
        [action.payload.id],
      action.payload.clue
    );

    var dailyDouble = action.payload.dailyDouble ||
      action.payload.clue && action.payload.clue.dailyDouble;

    var scoreAddend = opts.getReducer(null)(clue.value, {
      type: "SANITIZE_SCORE",
    });

    var responseType = action.payload.responseType;

    if (
      responseType === "skip" ||
      responseType === "wrong" && (
        dailyDouble && !state.deduct_incorrect_daily_double ||
        !dailyDouble && !state.deduct_incorrect_clue
      )
    ) {
      scoreAddend *= 0;
    }
    else if (responseType === "wrong") {
      scoreAddend *= -1;
    }

    state = opts.getReducer()(state, {
      type: "CHANGE_PLAYER_SCORE",
      payload: {
        index: action.payload.playerId,
        score: state.players[action.payload.playerId].score + scoreAddend,
      }
    });

    state = update(state, {
      current_clue: {
        players: {$push: [action.payload.playerId]}
      }
    });

    if (responseType ==="right") {
      state = opts.getReducer()(state, {
        type: "SET_CURRENT_PLAYER",
        payload: {
          index: action.payload.playerId
        }
      });
    }

    if (
      // Every player has responded.
      state.current_clue.players.length === state.players.length ||
      responseType === "right" ||
      dailyDouble
    ) {
      state = opts.getReducer()(state, {
        type: "FINISH_CLUE",
        payload: action.payload,
      });
    }

    return state;
  }

  process_clue_response.factory = factory;

  return process_clue_response;
}
