"use strict";

var Component = require("app/component/presentational/cell");
var React = require("react");
var test = require("tape");
var util = require("util");
var validatePropTypes = require("validate-react-prop-types")
  .validate.factory({quiet: true});

var desc;
var suiteDesc = "component/cell : ";

function noop () {}

test(suiteDesc + "Correctly validates valid propTypes", function (t) {
  var props = [
    {label: "200"},
    {label: 200},
    {label: "200", clue_count: 6},
    {label: "200", openClue: noop},
    {label: "200"},
  ];

  props.forEach(function (props) {
    t.ok(validatePropTypes(
      <Component {...props} />
    ).valid, "With " + util.inspect(props));
  });

  t.end();
});

test(suiteDesc + "Correctly validates invalid propTypes", function (t) {
  var props = [
    {},
    {label: 200, clue_count: "6"},
  ];

  props.forEach(function (props) {
    t.ok(validatePropTypes.quiet(
      <Component {...props} />
    ).error, "With " + util.inspect(props));
  });

  t.end();
});

desc = suiteDesc + "Correctly validates selected invalid propTypes";
test(desc, function (t) {
  var props = [
    {clue_count: "6"},
    {clue_count: false},
    {openClue: false},
  ];

  props.forEach(function (props) {
    t.ok(validatePropTypes.quiet(
      <Component {...props} />,
      {whitelist: Object.keys(props)}
    ).error, "With " + util.inspect(props));
  });

  t.end();
});
