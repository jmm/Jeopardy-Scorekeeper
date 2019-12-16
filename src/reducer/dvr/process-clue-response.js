"use strict";

const {reducer: set_current_player} = require("app/reducer/set-current-player");
const {reducer: standard_process_clue_response} = require("app/reducer/process-clue-response");

function process_clue_response (state, action) {
  var current_player = state.current_player;

  state = standard_process_clue_response(state, action);

  if (action.payload.responseType !== "right") {
    ++current_player;
    if (current_player > state.players.length - 1) current_player = 0;

    state = set_current_player(state, {
      type: "SET_CURRENT_PLAYER",
      payload: {
        index: current_player,
      }
    });
  }

  return state;
}

module.exports = {reducer: process_clue_response};
