"use strict";

var assign = require("object-assign");

exports.reducer = add_players;

function add_players (state, action) {
  return assign({}, state, {
    players: [...state.players, ...action.payload.players.map(player => {
      if (player.score == null) player.score = 0;
      return player;
    })],
  });
}
