"use strict";

var assign = Object.assign;
var reduce = require("app/reducer/open-clue").reducer;
var test = require("tape");

var baseState = {
  current_clue: null,
};

var baseAction = {
  type: "OPEN_CLUE",
  payload: {
    categoryId: 123,
    id: 456
  }
};

var suiteDesc = "reducer/open-clue : ";

test(suiteDesc + "Opens clue", function (t) {
  var action = baseAction;

  var state = reduce(baseState, action);

  t.notEqual(state, baseState, "Didn't mutate input state");

  t.deepEquals(state.current_clue, assign({
    players: [],
  }, baseAction.payload), "Correctly opened clue");

  t.end();
});
