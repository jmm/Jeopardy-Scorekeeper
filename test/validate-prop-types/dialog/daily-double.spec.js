"use strict";

var _ = require("lodash");
var assign = Object.assign;
var Component = require("app/component/presentational/dialog/daily-double");
var React = require("react");
var test = require("tape");
var util = require("util");
var validatePropTypes = require("validate-react-prop-types").validate;

var desc;
var suiteDesc = "component/dialog/daily-double : ";

function noop () {}

var baseProps = {
  clue: {
    id: 0,
    categoryId: 0,
    value: 200,
  },
  current_player: 0,
  players: [{}],
  wagers: {
    maximum: 1000,
    minimum: 5,
  },
  processResponse: noop,
  cancel: noop,
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

test(suiteDesc + "Invalid props fail", function (t) {
  var invalidProps = {
    clue: [],
    current_player: "0",
    players: {},
    wagers: [],
    processResponse: false,
    cancel: false,
  };

  Object.keys(invalidProps).forEach(function (key) {
    var props = {};
    props[key] = invalidProps[key];
    t.equal(validatePropTypes.quiet(<Component {...props} />, {
      whitelist: [key],
    }).error.react.prop, key, "Invalid " + key + " fails");
  });

  t.end();
});

desc = suiteDesc + "Correctly validates selected nested invalid props";
test(desc, function (t) {
  var keys = ["clue", "wagers"];
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
