"use strict";

var update = require("react-addons-update");
const {reducer: player_change_score} = require("app/reducer/player-change-score");

function change_player_score (state, action) {
  return update(state, {
    players: {
      [action.payload.index]: {
        $set: player_change_score(
          state.players[action.payload.index],
          {...action, type: "PLAYER_CHANGE_SCORE"},
        ),
      }
    }
  });
}

module.exports = {reducer: change_player_score};
