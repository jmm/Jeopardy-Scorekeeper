"use strict";

var _ = require("lodash");
var assign = Object.assign;
var Component = require("app/component/presentational/cfg");
var React = require("react");
var test = require("tape");
var util = require("util");
var validatePropTypes = require("validate-react-prop-types")
  .validate.factory({quiet: true});

function noop () {}

var suiteDesc = "component/cfg : ";

// The required props with valid values.
var baseProps = {
  deduct_incorrect_clue: true,
  deduct_incorrect_daily_double: true,
  change_round_player_method: 0,
  changeConfig: noop,
  ui: {
    display_clue_counts: true,
  },
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
    {deduct_incorrect_clue: 1},
    {deduct_incorrect_daily_double: 1},
    {change_round_player_method: false},
    {changeConfig: false},
    {ui: []},
    {ui: {
      display_clue_counts: 1,
    }},
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
  var keys = ["ui"];
  keys.forEach(function (key) {
    Object.keys(baseProps[key]).forEach(subKey => {
      var props = {
        [key]: {[subKey]: "0"}
      };

      var path = [key, subKey];

      var validation = validatePropTypes.quiet(<Component {...props} />, {
        whitelist: [path],
      });

      t.deepEqual(
        validation.error.react.prop,
        path,
        `Errors on correct prop "${path.join(".")}"`
      );
    });
  });

  t.end();
});
