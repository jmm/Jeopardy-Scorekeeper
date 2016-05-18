"use strict";

var assign = require("object-assign");
var reducerUtil = require("app/reducer-util");

var reducers = {};

reducers.actions = {
  OPEN_DIALOG: function (state, action) {
    return [...state, action.payload];
  },

  CLOSE_DIALOG: function (state, action) {
    return state.slice(0, -1);
  },

  ADVANCE_ROUND: function (state, action) {
    return [];
  },
};

Object.keys(reducers.actions).forEach(key => {
  reducers.actions[key] = {
    reducer: reducers.actions[key],
  };
});

exports.factory = reducerUtil.factory(assign({
  state: [],
}, reducers)).factory;
