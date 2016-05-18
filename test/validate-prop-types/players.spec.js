"use strict";

var _ = require("lodash");
var Component = require("app/component/presentational/players");
var React = require("react");
var test = require("tape");
var util = require("util");
var validatePropTypes = require("validate-react-prop-types").validate;

var desc;
var suiteDesc = "component/players : ";

function noop () {}

var baseProps = {
};

test(suiteDesc + "Correctly validates valid propTypes", function (t) {
  var props = [
    _.assign({}, baseProps),
  ];

  props.forEach(function (props) {
    t.ok(validatePropTypes(
      <Component {...props} />
    ).valid, "Validating " + util.inspect(props));
  });

  t.end();
});

test(suiteDesc + "Correctly validates invalid propTypes", function (t) {
  var props = [
    {players: {}},
    {current_player: "0"},
  ];

  props.forEach(function (props) {
    t.ok(validatePropTypes.quiet(
      <Component {...props} />
    ).error, "Validating " + util.inspect(props));
  });

  t.end();
});
