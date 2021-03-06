"use strict";

var assign = Object.assign;
var Component = require("app/component/presentational/dialog/final-jeopardy");
var React = require("react");
var test = require("tape");
var util = require("util");
var validatePropTypes = require("validate-react-prop-types").validate;

var suiteDesc = "component/dialog/final-jeopardy : ";

function noop () {}

var baseProps = {
  players: [{}],
  num_tv_players: 3,
  sanitizeScore: noop,
  endGame: noop,
};

test(suiteDesc + "Valid props pass", function (t) {
  var props = [
    assign({}, baseProps),
  ];

  props.forEach(function (props) {
    t.ok(validatePropTypes(
      <Component {...props} />
    ).valid, "Validating " + util.inspect(props));
  });

  t.end();
});

test(suiteDesc + "Missing required props fail", function (t) {
  Object.keys(baseProps).forEach(function (key) {
    var props = assign({}, baseProps);
    delete props[key];

    var validation = validatePropTypes.quiet(<Component {...props} />, {
      whitelist: [key],
    });

    t.equal(
      validation.error.react.prop, key, `Errors on correct prop "${key}"`
    );
  });

  t.end();
});

test(suiteDesc + "Invalid props fail", function (t) {
  var invalidPropGroups = [
    {players: {}},
    {players: [1]},
    {num_tv_players: "3"},
    {sanitizeScore: false},
    {endGame: false},
  ];

  invalidPropGroups.forEach(invalidProps => {
    Object.entries(invalidProps).forEach(function ([key, value]) {
      const props = {[key]: value};

      const validation = validatePropTypes.quiet(<Component {...props} />, {
        whitelist: [key],
      }).error.react.prop

      t.equal(validation, key, `Invalid ${key} fails`);
    })
  });

  t.end();
});
