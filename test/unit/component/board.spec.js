"use strict";

var _ = require("lodash");
var Cell = require("app/component/presentational/cell");
var Component = require("app/component/presentational/board");
var enzyme = require("enzyme");
var React = require("react");
var test = require("tape");

var suiteDesc = "component/board : ";
var desc;

function noop () {}

var baseProps = {
  openClue: noop,

  board: [
    [
      {value: 200},
      {value: 400},
    ],

    [
      {value: 200},
      {
        value: 400,
        enabled: true,
      },
    ],
  ],
};

desc = suiteDesc + "Shallow renders correctly";
test(desc, function (t) {
  var props = _.assign({}, baseProps);

  var el = <Component {...props} />;

  var wrapper = enzyme.shallow(el);

  var cells = wrapper.find(Cell);

  t.equal(
    cells.length,
    baseProps.board[0].length,
    "Should be a cell for each board row."
  );

  cells.forEach((child, i) => {
    t.equal(
      !!child.prop("openClue"),
      baseProps.board.some(category => {
        return category[i].enabled;
      }),
      "Cell should be enabled when row has an enabled clue."
    );
  });

  t.end();
});
