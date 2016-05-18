"use strict";

var reduce = require("app/reducer/close-clue").reducer;
var test = require("tape");

var baseState = {
  current_clue: {},
};

var baseAction = {
  type: "CLOSE_CLUE",
};

var suiteDesc = "reducer/close-clue : ";

test(suiteDesc + "Closes clue", function (t) {
  var action = baseAction;

  var state = reduce(baseState, action);

  t.notEqual(state, baseState, "Didn't mutate input state");

  t.equal(
    state.current_clue,
    null,
    "Closed clue"
  );

  t.end();
});
