"use strict";

var defaultInitialState = require("app/initial-state");
var reducers = require("app/reducers");
var Redux = require("redux");
var reduxUtils = require("app/util/redux-utils");

var defaultReducer = reducers.game;

function createStore (reducer, initialState) {
  reducer = reducer || defaultReducer;
  reducer = reduxUtils.makeHydratableReducer(reducer, "HYDRATE");
  initialState = initialState || defaultInitialState;

  const enhancer = (function () {
    if (process.env.NODE_ENV === "production") return

    const {DevTools} = require("app/component/dev-tools");
    return DevTools.instrument();
  })();

  return Redux.createStore(reducer, initialState, enhancer);
}

module.exports = createStore;
