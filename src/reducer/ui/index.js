"use strict";

const {makeReducer} = require("app/util")
var upperCaseKeys = require("app/util/upper-case-keys");

var dialog_stack = require("./dialog-stack").reducer;

var {factory: change_config_factory} = require("../change-config");

const change_config = change_config_factory({
  whitelist: [
    "display_clue_counts",
  ],
});

const defaultState = {
  state: {
    display_clue_counts: true,
  },
};

const reducers = {
  actions: upperCaseKeys({
    change_config,
  }),

  slices: {
    dialog_stack,
  },
};

const reducer = makeReducer({
  defaultState,
  ...reducers,
});

module.exports = {reducer};
