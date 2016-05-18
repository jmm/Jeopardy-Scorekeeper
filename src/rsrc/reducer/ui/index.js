"use strict";

var assign = require("object-assign");
var reducerUtil = require("app/reducer-util");
var upperCaseKeys = require("app/util/upper-case-keys");

var dialog_stack = require("./dialog-stack");

var change_config = require("../change-config");

var reducers = {};

reducers.actions = {};

var custom_change_config = function factory (opts) {
  opts = assign({}, opts, {
    whitelist: [
      "display_clue_counts",
    ],
  });
  var reducer = change_config.factory(opts);
  reducer.factory = factory;
  return reducer;
};

custom_change_config.factory = custom_change_config;

reducers.actions.change_config = custom_change_config;

upperCaseKeys(reducers.actions);

reducers.slices = {
  dialog_stack,
};

exports.factory = reducerUtil.factory(assign({
  state: {
    display_clue_counts: true,
  },
}, reducers)).factory;
