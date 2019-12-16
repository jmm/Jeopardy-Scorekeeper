"use strict";

var _ = require("lodash");
const {sanitizeScore} = require("app/util/sanitize-score");
var test = require("tape");

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

var suiteDesc = "util/sanitize-score : ";

fixtures.forEach(function (fixture) {
  fixture = _.zipObject(fixtures.keys, fixture);
  var message = `Sanitizes ${JSON.stringify(fixture.input)} input`;
  var desc = suiteDesc + message;

  test(desc, function (t) {
    var state = sanitizeScore(fixture.input);
    t.equals(state, fixture.output, message);
    t.end();
  });
});
