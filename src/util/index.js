"use strict";

function makeReducer ({
  defaultState,
  actions,
  slices,
}) {
  return function (state = defaultState, action) {
    const actionReducer = actions && action ? actions[action.type] : undefined;

    let nextState = actionReducer ? actionReducer(state, action) : state

    return Object.entries(slices || {})
    .reduce((nextState, [sliceId, sliceReducer]) => ({
      ...nextState,
      [sliceId]: sliceReducer(nextState[sliceId], action),
    }), nextState)
  }
}

module.exports = {
  makeReducer,
};
