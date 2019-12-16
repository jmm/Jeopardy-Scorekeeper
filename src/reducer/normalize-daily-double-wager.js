"use strict";

const {sanitizeScore} = require("app/util/sanitize-score");

/**
 * Normalize daily double wager.
 */
function normalize_daily_double_wager (state, action) {
  if (action.type !== "NORMALIZE_DAILY_DOUBLE_WAGER") return state;
  state = sanitizeScore(state);

  if (
    !action.payload.correct &&
    !action.payload.deduct_incorrect_daily_double
  ) {
    state = 0;
  }
  else {
    state = Math.max(
      // Lower bound.
      action.payload.min_daily_double_wager,

      Math.min(
        state,

        // Upper bound.
        Math.max(
          action.payload.max_clue_value,
          action.payload.score
        )
      )
    );
  }

  return state;
}

module.exports = {reducer: normalize_daily_double_wager};
