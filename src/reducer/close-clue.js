"use strict";

const {assign} = Object;

exports.reducer = close_clue;

function close_clue (state, action) {
  if (action.type !== "CLOSE_CLUE") return state;
  state = assign({}, state, {
    current_clue: null,
  });
  return state;
}
