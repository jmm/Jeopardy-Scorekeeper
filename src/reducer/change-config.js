"use strict";

const {assign} = Object;

function factory ({whitelist}) {
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

  return change_config;
}

module.exports = {factory};
