"use strict";

exports.factory = factory;

function factory (opts) {
  /**
   * Normalize daily double wager.
   */
  function normalize_daily_double_wager (state, action) {
    if (action.type !== "NORMALIZE_DAILY_DOUBLE_WAGER") return state;
    state = opts.getReducer(null)(state, {
      type: "SANITIZE_SCORE",
    });

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

  normalize_daily_double_wager.factory = factory;

  return normalize_daily_double_wager;
}
