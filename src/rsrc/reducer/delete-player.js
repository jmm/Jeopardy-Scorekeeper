"use strict";

var assign = require("object-assign");

exports.reducer = delete_player;

function delete_player (state, action) {
  var players = [...state.players];
  players.splice(action.payload.index, 1);
  var current_player = action.payload.index === state.current_player ?
    null :
    state.current_player;

  return assign({}, state, {
    players,
    current_player,
  });
}
