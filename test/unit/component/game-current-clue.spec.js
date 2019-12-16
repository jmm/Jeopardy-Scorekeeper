"use strict";

var assign = Object.assign;
var Component = require("app/component/presentational/game-current-clue");
var React = require("react");
var ReactTestUtils = require("react-addons-test-utils")
var test = require("tape");
var update = require("react-addons-update");

var suiteDesc = "component/game-current-clue : ";
var desc;

function getName (el) {
  return el.type.displayName || el.type.name;
}

function render (el) {
  var renderer = ReactTestUtils.createRenderer();
  renderer.render(el);
  return renderer.getRenderOutput();
}

function noop () {}

var baseProps = {
  dispatch: noop,
  min_daily_double_wager: 5,
  current_player: 0,
  players: [],
  rounds: [
    {
      board: [
        [
          {value: 200},
          {value: 400, dailyDouble: true},
        ],
      ],

      max_clue_value: 1000,
    },
  ],

  current_clue: {
    categoryId: 0,
    id: 0,
    players: [],
  },
};

desc = suiteDesc + "Shallow renders clue correctly";
test(desc, function (t) {
  var props = assign({}, baseProps);

  var el = <Component {...props} />;

  var rendered = render(el);

  t.ok(
    getName(rendered).indexOf("DialogClue") >= 0,
    "Returned element should be DialogClue"
  );

  t.end();
});

desc = suiteDesc + "Shallow renders designated daily double correctly";
test(desc, function (t) {
  var props = update(baseProps, {
    current_clue: {
      id: {$set: 1}
    }
  });

  var el = <Component {...props} />;

  var rendered = render(el);

  t.ok(
    getName(rendered).indexOf("DialogDailyDouble") >= 0,
    "Returned element should be DialogDailyDouble"
  );

  t.end();
});

desc = suiteDesc + "Shallow renders promoted daily double correctly";
test(desc, function (t) {
  var props = update(baseProps, {
    current_clue: {
      dailyDouble: {$set: true}
    }
  });

  var el = <Component {...props} />;

  var rendered = render(el);

  t.ok(
    getName(rendered).indexOf("DialogDailyDouble") >= 0,
    "Returned element should be DialogDailyDouble"
  );

  t.end();
});
