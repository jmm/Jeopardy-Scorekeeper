"use strict";

var game = require("app/reducer/game");
var reduce = require("app/reducer/change-config").factory();
var test = require("tape");
var update = require("react-addons-update");

var desc;
var baseState = game.factory().reducer();

var baseAction = {
  type: "CHANGE_CONFIG",
  payload: {},
};

var params = {};
params.valid = `
  change_round_player_method
  deduct_incorrect_clue
  deduct_incorrect_daily_double
`.trim().split(/\s+/);
params.invalid = Object.keys(baseState).filter(
  key => params.valid.indexOf(key) < 0
);

var suiteDesc = "reducer/change-config : ";

desc = suiteDesc + "Doesn't update invalid params";
test(desc, function (t) {
  var value = Date.now();

  params.invalid.forEach(param => {
    var state = reduce(baseState, update(baseAction, {
      payload: {$set: {
        param: param,
        value,
      }},
    }));

    t.equal(state, baseState, "Didn't mutate logical state");
    t.equal(
      state[param],
      baseState[param],
      `Didn't set invalid param ${"`" + param + "`"}`
    );
  });

  t.end();
});

desc = suiteDesc + "Updates valid params";
test(desc, function (t) {
  var value = Date.now();

  params.valid.forEach(param => {
    var state = reduce(baseState, update(baseAction, {
      payload: {$set: {
        param: param,
        value,
      }},
    }));

    t.notEqual(state, baseState, "Didn't mutate state input");
    t.equal(
      state[param],
      value,
      `Set valid param ${"`" + param + "`"}`
    );
  });

  t.end();
});

desc = suiteDesc + "Coerces to boolean";
test(desc, function (t) {
  var value = "truthy";
  var param = "deduct_incorrect_clue";

  var state = reduce(baseState, update(baseAction, {
    payload: {$set: {
      param: param,
      value,
      type: "boolean",
    }},
  }));

  t.equal(
    state[param],
    Boolean(value),
    `Param ${"`" + param + "`"} coerced to boolean`
  );

  t.end();
});

desc = suiteDesc + "Coerces to integer";
test(desc, function (t) {
  var value = " 10.00 ";
  var param = "deduct_incorrect_clue";

  var state = reduce(baseState, update(baseAction, {
    payload: {$set: {
      param: param,
      value,
      type: "integer",
    }},
  }));

  t.equal(
    state[param],
    10,
    `Param ${"`" + param + "`"} coerced to integer`
  );

  t.end();
});
