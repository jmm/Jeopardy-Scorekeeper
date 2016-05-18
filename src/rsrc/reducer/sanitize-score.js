"use strict";

var assign = require("object-assign");
var update = require("react-addons-update");

exports.reducer = sanitize_score;

function sanitize_score (state, action) {
  if (action.type !== "SANITIZE_SCORE") return state;

  function sanitize_score (score) {
    if (typeof score === 'string') {
      score = (score.trim().match(/^[0-9-]+/) || [""])[0];
    }
    else if (typeof score !== "number") score = 0;

    score = Math.round(score);

    if (isNaN(score)) {
      score = 0;
    }
    // if

    return score;
  }
  // sanitize_score

  return sanitize_score(state);
}
