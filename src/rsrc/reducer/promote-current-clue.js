"use strict";

var update = require("react-addons-update");

exports.reducer = open_clue;

function open_clue (state, action) {
  if (action.type !== "PROMOTE_CURRENT_CLUE") return state;
  state = update(state, {
    current_clue: {
      dailyDouble: {$set: true}
    }
  });
  return state;
}
