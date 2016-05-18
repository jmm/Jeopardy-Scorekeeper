"use strict";

var assign = require("object-assign");

exports.reducer = set_current_player;

function set_current_player (state, action) {
  return assign({}, state, {
    current_player: action.payload.index,
  });
}
