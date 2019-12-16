"use strict";

var reduce = require("app/reducer/normalize-daily-double-wager").reducer;
var test = require("tape");
var update = require("react-addons-update");

var baseAction = {
    type: "NORMALIZE_DAILY_DOUBLE_WAGER",
    payload: {
      min_daily_double_wager: 5,
      max_clue_value: 1000,
      score: null,
      correct: null,
      deduct_incorrect_daily_double: true,
    }
};

var suiteDesc = "reducer/normalize-daily-double-wager : ";

test(suiteDesc + "Correctly allows true daily double", function (t) {
  function makeAction (payload) {
    return update(baseAction, {
      payload: payload,
    });
  }

  var wager = 2222;
  var score = wager;

  var newState = reduce(wager, makeAction({
    score: {$set: score},
    correct: {$set: true},
  }));

  t.equal(newState, wager);
  t.end();
});

test(suiteDesc + "Correctly limits true daily double", function (t) {
  function makeAction (payload) {
    return update(baseAction, {
      payload: payload,
    });
  }

  var score = 999;
  var wager = score * 2;

  var newState = reduce(wager, makeAction({
    score: {$set: score},
    correct: {$set: true},
  }));

  t.equal(newState, baseAction.payload.max_clue_value);
  t.end();
});
