"use strict";

var _ = require("lodash");
var Component = require("app/component/presentational/board");
var React = require("react");
var test = require("tape");
var util = require("util");
var validatePropTypes = require("validate-react-prop-types")
  .validate.factory({quiet: true});

var desc;
var suiteDesc = "component/board : "

test(suiteDesc + "Correctly validates valid propTypes", function (t) {
  var props = [
    {
      board: [
        [
          {}
        ]
      ]
    },
  ];

  props.forEach(function (props) {
    t.ok(validatePropTypes(
      <Component {...props} />
    ).valid, "With " + util.inspect(props));
  });

  t.end();
});

test(suiteDesc + "Correctly validates selected valid propTypes", function (t) {
  var props = [
    {display_clue_counts: false},
  ];

  props.forEach(function (props) {
    t.ok(validatePropTypes.quiet(
      <Component {...props} />,
      {whitelist: Object.keys(props)}
    ).valid, "With " + util.inspect(props));
  });

  t.end();
});

desc = suiteDesc + "Correctly validates selected invalid propTypes";
test(desc, function (t) {
  var props = [
    {display_clue_counts: 1},
    {board: {}},
  ];

  props.forEach(function (props) {
    t.ok(validatePropTypes.quiet(
      <Component {...props} />,
      {whitelist: Object.keys(props)}
    ).error, "With " + util.inspect(props));
  });

  t.end();
});
