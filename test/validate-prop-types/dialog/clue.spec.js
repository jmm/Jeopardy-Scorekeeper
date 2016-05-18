"use strict";

var assign = Object.assign;
var Component = require("app/component/presentational/dialog/clue");
var React = require("react");
var test = require("tape");
var util = require("util");
var validatePropTypes = require("validate-react-prop-types").validate;

var desc;
var suiteDesc = "component/dialog/clue : ";

function noop () {}

var baseProps = {
  clue: {
    id: 0,
    categoryId: 0,
    value: 200,
    players: [{}],
  },
  current_player: 0,
  players: [{}],
  processResponse: noop,
  close: noop,
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

test(suiteDesc + "Correctly validates missing required props", function (t) {
  Object.keys(baseProps).forEach(function (key) {
    var props = assign({}, baseProps);
    delete props[key];

    var validation = validatePropTypes.quiet(<Component {...props} />, {
      whitelist: [key],
    });

    t.equal(
      validation.error.react.prop, key, `Errors on correct prop "${key}"`
    );

    if (baseProps[key] && !Array.isArray(baseProps[key])) {
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
  var props = [
    {clue: []},
    {current_player: false},
    {players: {}},
    {processResponse: false},
    {close: false},
  ];

  props.forEach(function (props) {
    var keys = Object.keys(props);
    t.equal(validatePropTypes.quiet(<Component {...props} />, {
      whitelist: keys,
    }).error.react.prop, keys[0], "Invalid " + keys[0] + " fails");
  });

  t.end();
});

desc = suiteDesc + "Correctly validates selected nested invalid props";
test(desc, function (t) {
  var key = "clue";
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

  t.end();
});
