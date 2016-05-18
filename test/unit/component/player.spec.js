"use strict";

var assign = Object.assign;
var Component = require("app/component/presentational/player");
var enzyme = require("enzyme");
var Model = require("app/model/player");
var React = require("react");
var test = require("tape");
var util = require("util");

var suiteDesc = "component/player : ";
var desc;

function noop () {}

var baseProps = {
  score: 100,
  index: 0,
  takeControl: noop,
  delete: noop,
  changeName: noop,
  changeScore: noop,
};

desc = suiteDesc + "Shallow renders correctly [round 0, !has-control, name]";
test(desc, function (t) {
  var props = assign({}, baseProps, {
    name: "Monkey",
  });

  var el = <Component {...props} />;

  var wrapped = enzyme.shallow(el);

  t.assert(
    !wrapped.hasClass("has-control"),
    "Should not have control of the board"
  );

  t.assert(
    wrapped.find("input.name").prop("value") === props.name,
    "Rendered name should be: " + props.name
  );

  t.assert(
    wrapped.find("input.score").prop("value") === props.score,
    "Rendered score should be: " + props.score
  );

  t.assert(
    wrapped.find(".delete").length,
    "Delete should be enabled"
  );

  t.assert(
    wrapped.find(".set-has-control").length,
    "Make Current should be enabled"
  );

  t.end();
});

desc = suiteDesc + "Shallow renders correctly [round 0, has-control]";
test(desc, function (t) {
  var props = assign({}, baseProps, {
    hasControl: true,
  });

  var el = <Component {...props} />;

  var wrapped = enzyme.shallow(el);

  t.assert(
    wrapped.hasClass("has-control"),
    "Control of the board"
  );

  t.end();
});

desc = suiteDesc + "Shallow renders correctly [round 0, !has-control, !name]";
test(desc, function (t) {
  var props = assign({}, baseProps, {
  });

  var model = new Model({}, {
    index: props.index,
  });

  var el = <Component {...props} />;

  var wrapped = enzyme.shallow(el);

  t.equal(
    wrapped.find("input.name").prop("value"),
    model.getDisplayName(),
    "Rendered name"
  );

  t.end();
});

desc = suiteDesc + "Shallow renders correctly [round 1, !has-control, !name]";
test(desc, function (t) {
  var props = assign({}, baseProps, {
    rounds: [{}],
    delete: null,
  });

  var model = new Model({}, {
    index: props.index,
  });

  var el = <Component {...props} />;

  var wrapped = enzyme.shallow(el);

  t.assert(
    !wrapped.hasClass("has-control"),
    "Should not have control of the board"
  );

  t.equal(
    wrapped.find("input.name").prop("value"),
    model.getDisplayName(),
    "Rendered name"
  );

  t.assert(
    wrapped.find("input.score").prop("value") === props.score,
    "Rendered score should be: " + props.score
  );

  t.assert(
    !wrapped.find(".delete").length,
    "Delete should be !enabled"
  );

  t.assert(
    wrapped.find(".set-has-control").hasClass("enabled"),
    "Make Current should be enabled"
  );

  t.end();
});

desc = suiteDesc + "Shallow renders correctly [round 1, has-control]";
test(desc, function (t) {
  var props = assign({}, baseProps, {
    hasControl: true,
  });

  var el = <Component {...props} />;

  var wrapped = enzyme.shallow(el);

  t.assert(
    wrapped.hasClass("has-control"),
    "Has control of the board?"
  );

  t.end();
});
