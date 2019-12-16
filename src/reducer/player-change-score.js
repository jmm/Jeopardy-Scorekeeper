"use strict";

const {assign} = Object;
const {sanitizeScore} = require("app/util/sanitize-score");

function player_change_score (state, action) {
  return assign({}, state, {
    score: sanitizeScore(action.payload.score),
  });
}

module.exports = {reducer: player_change_score};
