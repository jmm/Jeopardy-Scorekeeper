"use strict";

const {assign} = Object;
var update = require("react-addons-update");
const {sanitizeScore} = require("app/util/sanitize-score");
const {reducer: change_player_score} = require("app/reducer/change-player-score");
const {reducer: set_current_player} = require("app/reducer/set-current-player");
const {reducer: finish_clue} = require("app/reducer/finish-clue");

function process_clue_response (state, action) {
  // payload.clue can override `value|dailyDouble`.
  var clue = assign(
    {},

    state.rounds.slice(-1)[0].board[
      action.payload.categoryId
    ][action.payload.id],

    action.payload.clue
  );

  var dailyDouble = action.payload.dailyDouble ||
    action.payload.clue && action.payload.clue.dailyDouble;

  var scoreAddend = sanitizeScore(clue.value);
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

  state = change_player_score(state, {
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
    state = set_current_player(state, {
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
    state = finish_clue(state, {
      type: "FINISH_CLUE",
      payload: {...action.payload, clue},
    });
  }

  return state;
}

module.exports = {reducer: process_clue_response};
