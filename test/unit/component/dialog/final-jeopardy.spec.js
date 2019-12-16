"use strict";

var assign = Object.assign;
var Component = require("app/component/presentational/dialog/final-jeopardy");
var enzyme = require("enzyme");
var React = require("react");
var test = require("tape");

var suiteDesc = "component/presentational/dialog/clue : ";
var desc;

function noop () {}

var baseProps = {
  num_tv_players: 0,
  players: [{
    score: 0,
  }],
  endGame: noop,
  sanitizeScore: noop,
};

// TODO:JMM should probably break out the player component and test there.
desc = suiteDesc + "Renders default name for nameless live players";
test(desc, function (t) {
  var props = assign({}, baseProps);

  var el = <Component {...props} />;

  var wrapper = enzyme.shallow(el);

  t.notEqual(
    wrapper.find(".players").childAt(0).prop("name"),
    undefined,
    "Player should have default name prop"
  );

  t.end();
});
