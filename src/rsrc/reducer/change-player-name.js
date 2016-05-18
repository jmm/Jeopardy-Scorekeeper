"use strict";

var update = require("react-addons-update");

exports.reducer = change_player_name;

function change_player_name (state, action) {
  return update(state, {
    players: {
      [action.payload.index]: {
        name: {$set: action.payload.name},
      }
    }
  });
}
