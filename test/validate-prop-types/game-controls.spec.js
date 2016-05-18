"use strict";

var _ = require("lodash");
var Component = require("app/component/presentational/game-controls");
var React = require("react");
var test = require("tape");
var util = require("util");
var validatePropTypes = require("validate-react-prop-types")
  .validate.factory({quiet: true});

function noop () {}

var suiteDesc = "component/game-controls : ";

// The required props with valid values.
var baseProps = {
  rounds: [],
  players: [],
  advanceRound: noop,
  endRound: noop,
  endGame: noop,
};

test(suiteDesc + "Correctly validates valid propTypes", function (t) {
  var props = _.assign({}, baseProps);

  var validation = validatePropTypes(<Component {...baseProps} />);
  t.ok(
    validation.valid,
    "Validating " + util.inspect(props)
  );
  t.end();
});

test(suiteDesc + "Correctly validates selected valid propTypes", function (t) {
  var props = Object.keys(baseProps).map(function (key) {
    var spec = {};
    spec.key = baseProps[key];
    return spec;
  });

  props.forEach(props => {
    var validation = validatePropTypes.quiet(
      <Component {...props} />,
      {whitelist: Object.keys(props)}
    );
    t.ok(validation.valid, "Validating " + util.inspect(props));
  });

  t.end();
});

test(suiteDesc + "Correctly validates missing required props", function (t) {
  var props = [
    {},
  ];

  Object.keys(baseProps).forEach(function (key) {
    var spec = _.assign({}, baseProps);
    delete spec[key];
    props.push(spec);
  });

  props.forEach(function (props) {
    var validation = validatePropTypes.quiet(
      <Component {...props} />
    );

    t.ok(validation.error, "Validating " + util.inspect(props));
  });

  t.end();
});

var desc = suiteDesc + "Correctly validates selected invalid propTypes";
test(desc, function (t) {
  var props = [
    {rounds: {}},
    {players: {}},
    {advanceRound: false},
    {endRound: false},
    {endGame: false},
  ];

  props.forEach(function (props) {
    var validation = validatePropTypes.quiet(
      <Component {...props} />,
      {
        whitelist: Object.keys(props)
      }
    );

    t.ok(validation.error, "Validating " + util.inspect(props));
  });

  t.end();
});
