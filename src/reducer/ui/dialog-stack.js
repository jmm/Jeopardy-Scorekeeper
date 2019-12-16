"use strict";

const {makeReducer} = require("app/util");

const actionReducers = {
  OPEN_DIALOG: function (state, action) {
    return [...state, action.payload];
  },

  CLOSE_DIALOG: function (state) {
    return state.slice(0, -1);
  },

  ADVANCE_ROUND: function () {
    return [];
  },
};

const defaultState = [];

const reducer = makeReducer({
  defaultState,
  actions: actionReducers,
});

module.exports = {reducer};
