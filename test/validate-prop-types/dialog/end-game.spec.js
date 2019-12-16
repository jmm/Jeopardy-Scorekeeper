"use strict";

var _ = require("lodash");
var assign = Object.assign;
var Component = require("app/component/presentational/dialog/end-game");
var React = require("react");
var test = require("tape");
var util = require("util");
var validatePropTypes = require("validate-react-prop-types").validate;

var suiteDesc = "component/dialog/daily-double : ";

function noop () {}

var baseProps = {
  close: noop,
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
    close: false,
    endGame: false,
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
