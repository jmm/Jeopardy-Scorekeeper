"use strict";

var _ = require("lodash");
var Component = require("app/component/presentational/cell");
var enzyme = require("enzyme");
var React = require("react");
var test = require("tape");

var suiteDesc = "component/cell : ";
var desc;

function noop () {}

var baseProps = {
  index: 0,
  clue_value: 200,
  label: 200,
  clue_count: 6,
  openClue: noop,
};

desc = suiteDesc + "Shallow renders correctly [openClue, clue_count]";
test(desc, function (t) {
  var props = _.assign({}, baseProps);

  var el = <Component {...props} />;

  var wrapped = enzyme.shallow(el);
  var rendered = wrapped.get(0);

  t.assert(
    React.Children.only(rendered.props.children),
    "Should have only child"
  );

  t.assert(
    rendered.props.className.split(" ").indexOf("enabled") >= 0,
    "Should have `enabled` class"
  );

  t.assert(
    wrapped.find(".count").text() === `(${props.clue_count})`,
    "Correct clue count text found"
  );

  t.end();
});

desc = suiteDesc + "Shallow renders correctly [!openClue, clue_count]";
test(desc, function (t) {
  var props = _.assign({}, baseProps, {openClue: null});

  var el = <Component {...props} />;

  var wrapped = enzyme.shallow(el);
  var rendered = wrapped.get(0);

  t.false(rendered.props.className.split(" ").indexOf("enabled") >= 0);

  t.assert(
    wrapped.find(".count").text() === `(${props.clue_count})`,
    "Correct clue count text found"
  );

  t.end();
});

desc = suiteDesc + "Shallow renders correctly [openClue, !clue_count]";
test(desc, function (t) {
  var props = _.assign({}, baseProps, {clue_count: undefined});
  var el = <Component {...props} />;
  var wrapped = enzyme.shallow(el);
  t.assert(!wrapped.find(".count").length, "Omitted count");
  t.end();
});
