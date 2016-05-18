"use strict";

var _ = require("lodash");
var reduce = require("app/reducer/sanitize-score").reducer;
var test = require("tape");

var baseState = {
  current_clue: null,
};

var baseAction = {
  type: "SANITIZE_SCORE",
  payload: {}
};

var fixtures = [
  // Input, output [, message]
  [undefined, 0],
  [null, 0],
  [false, 0],
  [true, 0],
  [123.456, 123],
  ["   ", 0],
  [" 123 ", 123],
  [" -123 ", -123],
  [" 123.456 ", 123],
];

fixtures.keys = ["input", "output", "message"];

var suiteDesc = "reducer/sanitize-score : ";

fixtures.forEach(function (fixture) {
  fixture = _.zipObject(fixtures.keys, fixture);

  var message = `Sanitizes ${JSON.stringify(fixture.input)} input`;
  var desc = suiteDesc + message;
  test(desc, function (t) {
    var action = baseAction;

    var state = reduce(fixture.input, action);

    t.equals(state, fixture.output, message);

    t.end();
  });
});
