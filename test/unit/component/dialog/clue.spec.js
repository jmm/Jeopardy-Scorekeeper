"use strict";

var assign = Object.assign;
var Component = require("app/component/presentational/dialog/clue");
var enzyme = require("enzyme");
var React = require("react");
var test = require("tape");

var suiteDesc = "component/dialog/clue : ";
var desc;

function noop () {}

var baseProps = {
  clue: {
    id: 0,
    categoryId: 0,
    value: 200,
    players: [],
  },

  current_player: 0,
  current_clue: {
    players: []
  },
  players: [{
    score: 0,
  }],
  processResponse: noop,
  close: noop,
};

desc = suiteDesc + "Shallow renders correctly [!dailyDouble]";
test(desc, function (t) {
  var props = assign({}, baseProps);

  var el = <Component {...props} />;

  var wrapper = enzyme.shallow(el);

  var cells = wrapper.childAt(0).children();

  t.equal(
    wrapper.find(".daily-double").length,
    0,
    "Shouldn't be a Daily Double button"
  );

  t.equal(
    wrapper.find(".prompt").text().trim(),
    "$" + baseProps.clue.value,
    "Prompt should show clue value"
  );

  t.equal(
    wrapper.findWhere(node =>
      node.type() &&
      (node.type().displayName || node.type().name) === "DialogPlayer"
    ).length,
    1,
    "Should be a DialogPlayer"
  );

  t.end();
});

desc = suiteDesc + "Shallow renders correctly [dailyDouble]";
test(desc, function (t) {
  var props = assign({openDailyDouble: noop}, baseProps);

  var el = <Component {...props} />;

  var wrapper = enzyme.shallow(el);

  var cells = wrapper.childAt(0).children();

  t.equal(
    wrapper.find(".daily-double").length,
    1,
    "Should be a Daily Double button"
  );

  t.end();
});
