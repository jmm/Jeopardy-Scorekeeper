"use strict";

var assign = require("object-assign");

// Valid params
var defaultWhitelist = [
  "change_round_player_method",
  "deduct_incorrect_clue",
  "deduct_incorrect_daily_double",
];

exports.factory = factory;

function factory (opts = {}) {
  var whitelist = opts.whitelist || defaultWhitelist;

  function change_config (state, action) {
    if (
      action.type !== "CHANGE_CONFIG" ||
      whitelist.indexOf(action.payload.param) < 0
    ) return state;

    var value = action.payload.value;

    switch (action.payload.type) {
      case "integer":
        value = parseInt(value, 10);
      break;

      case "boolean":
        value = !!value;
      break;
    }

    state = assign({}, state, {
      [action.payload.param]: value,
    });

    return state;
  }

  change_config.factory = factory;

  return change_config;
}
