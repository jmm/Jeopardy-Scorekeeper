"use strict";

var assign = require("object-assign");
var reducerUtil = require("app/reducer-util");
var player_change_score = require("./player-change-score");
var update = require("react-addons-update");
var upperCaseKeys = require("app/util/upper-case-keys");

exports.factory = factory;

function factory (opts) {
  function change_player_score (state, action) {
    return update(state, {
      players: {
        [action.payload.index]: {$set: opts.getReducer(null)(
          state.players[action.payload.index],
          assign({}, action, {
            type: "PLAYER_CHANGE_SCORE",
          })
        )}
      }
    });
  }

  change_player_score.factory = factory;

  return change_player_score;
}
