"use strict";

var assign = require("object-assign");

exports.factory = factory;

function factory (opts) {
  var original = opts.original && opts.original.factory ?
    opts.original.factory(assign({}, opts, {original: null})) :
    opts.original;

  function process_clue_response (state, action) {
    var current_player = state.current_player;

    state = original(state, action);

    if (action.payload.responseType !== "right") {
      ++current_player;
      if (current_player > state.players.length - 1) current_player = 0;

      state = opts.getReducer()(state, {
        type: "SET_CURRENT_PLAYER",
        payload: {
          index: current_player,
        }
      });
    }

    return state;
  }

  process_clue_response.factory = factory;

  return process_clue_response;
}
