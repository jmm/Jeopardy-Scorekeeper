"use strict";

var assign = require("object-assign");
var reducerUtil = require("app/reducer-util");
var update = require("react-addons-update");

exports.factory = factory;

function factory (opts) {
  function finish_clue (state, action) {
    if (action.type !== "FINISH_CLUE") return state;

    state = update(state, {
      rounds: {
        [state.rounds.length - 1]: {
          board: {
            [action.payload.categoryId]: {
              [action.payload.id]: {
                enabled: {$set: false}
              }
            },
          },

          dailyDoubles: {$apply: function (dailyDoubles) {
            if (action.payload.clue.dailyDouble) --dailyDoubles;
            return dailyDoubles;
          }},
        },
      },
    });

    state = opts.getReducer()(state, {
      type: "CLOSE_CLUE",
    });

    return state;
  }

  finish_clue.factory = factory;

  return finish_clue;
}
