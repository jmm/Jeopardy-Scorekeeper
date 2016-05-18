"use strict";

var reduce = require("app/reducer/demote-current-clue").reducer;
var test = require("tape");

var baseState = {
  current_clue: {
    dailyDouble: true,
  }
};

var baseAction = {
  type: "DEMOTE_CURRENT_CLUE",
};

var suiteDesc = "reducer/demote-current-clue : ";

test(suiteDesc + "Demotes current clue", function (t) {
  var action = baseAction;

  var state = reduce(baseState, action);

  t.notEqual(state, baseState, "Didn't mutate input state");

  t.notEqual(
    state.current_clue.dailyDouble,
    true,
    "Current clue is not a daily double"
  );

  t.end();
});
