"use strict";

var _ = require("lodash");
var reduce = require("app/reducer/normalize-daily-double-wager");
var sinon = require("sinon");
var test = require("tape");
var update = require("react-addons-update");
var upperCaseKeys = require("app/util/upper-case-keys");

function sanitize_score (state, action) {
  return state;
}

var spy = sanitize_score = sinon.spy(sanitize_score);

sanitize_score.detached = sanitize_score;

reduce = reduce.factory({
  getReducer: () => sanitize_score,
});

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

test(suiteDesc + "Correctly invokes sub reducer(s)", function (t) {
  spy.reset();

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

  t.equal(spy.callCount, 1, "Sub reducer called correct number of times");

  var action = spy.args[0][1];
  t.equal(action.type, "SANITIZE_SCORE", "Correct action.type");

  t.end();
});

test(suiteDesc + "Correctly allows true daily double", function (t) {
  spy.reset();

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
  spy.reset();

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
