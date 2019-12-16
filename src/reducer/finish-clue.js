"use strict";

var update = require("react-addons-update");
const {reducer: close_clue} = require("app/reducer/close-clue");

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

  state = close_clue(state, {
    type: "CLOSE_CLUE",
  });

  return state;
}

module.exports = {reducer: finish_clue};
