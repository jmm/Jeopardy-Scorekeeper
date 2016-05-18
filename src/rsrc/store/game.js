"use strict";

var defaultInitialState = require("app/initial-state");
var process_clue_response = require("app/reducer/dvr/process-clue-response");
var reducers = require("app/reducers");
var Redux = require("redux");
var upperCaseKeys = require("app/util/upper-case-keys");

var actions = upperCaseKeys({
  process_clue_response,
});

var defaultReducer = reducers.game.factory({
  actions,
}).reducer;

function createStore (reducer, initialState) {
  reducer = reducer || defaultReducer;
  initialState = initialState || defaultInitialState;

  return Redux.createStore(reducer, initialState,
    global.devToolsExtension ? global.devToolsExtension() : undefined
  );
}

module.exports = createStore;
