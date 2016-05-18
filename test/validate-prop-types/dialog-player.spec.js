"use strict";

var _ = require("lodash");
var assign = Object.assign;
var Component = require("app/component/presentational/dialog-player");
var React = require("react");
var test = require("tape");
var util = require("util");
var validatePropTypes = require("validate-react-prop-types").validate;

var desc;
var suiteDesc = "component/dialog-player : ";

var baseProps = {
  player: {
    score: 0,
  },
  index: 0,
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
    {},
    {rounds: {}, score: 100},
    {rounds: [], score: "100"},
  ];

  props.forEach(function (props) {
    t.ok(validatePropTypes.quiet(
      <Component {...props} />
    ).error, "Validating " + util.inspect(props));
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

desc = suiteDesc + "Correctly validates selected invalid propTypes";
test(desc, function (t) {
  var props = [
    {player: []},
    {index: "1"},
  ];

  props.forEach(function (props) {
    t.ok(validatePropTypes.quiet(
      <Component {...props} />,
      {whitelist: Object.keys(props)}
    ).error, "Validating " + util.inspect(props));
  });

  t.end();
});

desc = suiteDesc + "Correctly validates selected nested invalid props";
test(desc, function (t) {
  var keys = ["player"];
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
