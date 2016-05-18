"use strict";

var assign = require("object-assign");
var sanitize_score = require("app/reducer/sanitize-score");
var update = require("react-addons-update");

exports.factory = factory;

function factory (opts) {
  function player_change_score (state, action) {
    return assign({}, state, {
      score: opts.getReducer(null)(action.payload.score, {
        type: "SANITIZE_SCORE",
      }),
    });
  }

  player_change_score.factory = factory;

  return player_change_score;
}
