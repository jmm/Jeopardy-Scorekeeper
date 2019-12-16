"use strict";

const {assign} = Object;

function set_current_player (state, action) {
  return assign({}, state, {
    current_player: action.payload.index,
  });
}

module.exports = {reducer: set_current_player};
