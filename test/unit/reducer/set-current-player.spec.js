"use strict";

var assign = Object.assign;
var reduce = require("app/reducer/set-current-player").reducer;
var test = require("tape");

var baseState = {
  current_player: null,
};

var baseAction = {
  type: "SET_CURRENT_PLAYER",
};

var suiteDesc = "reducer/set-current-player : ";

test(suiteDesc + "Sets specified player", function (t) {
  [1, 10].forEach(function (index) {
    var action = assign({payload: {
      index,
    }}, baseAction);

    var state = reduce(baseState, action);

    t.notEqual(state, baseState, "Didn't mutate input state");

    t.equal(
      state.current_player,
      action.payload.index,
      "Set specified player: " + index
    );
  });

  t.end();
});
