"use strict";

var assign = Object.assign;
var reduce = require("app/reducer/promote-current-clue").reducer;
var test = require("tape");

var baseState = {
  current_clue: {},
};

var baseAction = {
  type: "PROMOTE_CURRENT_CLUE",
};

var suiteDesc = "reducer/promote-current-clue : ";

test(suiteDesc + "Promotes clue", function (t) {
  var action = baseAction;

  var state = reduce(baseState, action);

  t.notEqual(state, baseState, "Didn't mutate input state");

  t.equals(
    state.current_clue.dailyDouble,
    true,
    "Promoted clue"
  );

  t.end();
});
