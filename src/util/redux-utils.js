"use strict";

// See https://github.com/reactjs/redux/pull/658#issuecomment-136478950.
exports.makeHydratableReducer = function (reducer, hydrateActionType) {
  return function (state, action) {
    if (action.type === hydrateActionType) {
      state = action.payload.state;
    }

    return reducer(state, action);
  };
};
