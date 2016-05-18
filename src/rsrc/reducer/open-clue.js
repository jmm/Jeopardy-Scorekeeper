"use strict";

var assign = require("object-assign");

exports.reducer = open_clue;

function open_clue (state, action) {
  if (action.type !== "OPEN_CLUE") return state;
  state = assign({}, state, {
    current_clue: assign({
      // IDs of players who've responded.
      players: []
    }, action.payload),
  });
  return state;
}
