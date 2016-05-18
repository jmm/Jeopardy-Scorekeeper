"use strict";

var _ = require("lodash");
var assign = Object.assign;
var Component = require("app/component/presentational/game-current-clue");
var React = require("react");
var test = require("tape");
var util = require("util");
var validatePropTypes = require("validate-react-prop-types")
  .validate.factory({quiet: true});

function noop () {}

var suiteDesc = "component/game-current-clue : ";

// The required props with valid values.
var baseProps = {
  rounds: [],
  current_clue: {
    id: 0,
    categoryId: 0,
  },
  current_player: 0,
  players: [],
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

    if (_.isPlainObject(baseProps[key])) {
      (Object.keys(baseProps[key]) || []).forEach(subKey => {
        var props = {};
        props[key] = assign({}, baseProps[key]);
        delete props[key][subKey];

        validation = validatePropTypes.quiet(<Component {...props} />, {
          whitelist: [key],
        });

        t.equal(
          validation.error.react.prop,
          key,
          `Errors on correct prop "${key}.${subKey}"`
        );
      });
    }
  });

  t.end();
});

var desc = suiteDesc + "Correctly validates selected invalid propTypes";
test(desc, function (t) {
  var props = [
    {rounds: {}},
    {current_clue: 1},
    {current_player: "0"},
    {players: {}},
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

desc = suiteDesc + "Correctly validates selected nested invalid props";
test(desc, function (t) {
  var paths = [];
  var keys = ["current_clue"];
  keys.forEach(function (key) {
    Object.keys(baseProps[key]).forEach(subKey => {
      paths.push([key, subKey]);
    });
  });

  paths.push(["current_clue", "dailyDouble"]);

  paths.forEach(function (keyPath) {
    var props = {
      [keyPath[0]]: {[keyPath[1]]: "0"}
    };

    var validation = validatePropTypes.quiet(<Component {...props} />, {
      whitelist: [keyPath],
    });

    t.deepEqual(
      validation.error.react.prop,
      keyPath,
      `Errors on correct prop "${keyPath.join(".")}"`
    );
  });

  t.end();
});
