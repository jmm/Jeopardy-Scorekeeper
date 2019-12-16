"use strict";

const {assign} = Object;
var Cell = require("./cell");
var KeyboardNav = require("./keyboard-nav");
var keyboardNavCfg = require("./board-keyboard-nav");
const PropTypes = require('prop-types');
var React = require("react");

KeyboardNav = KeyboardNav(keyboardNavCfg);

function calculateClueCounts (board) {
  var clue_counts = {};

  board.forEach(category => {
    category.forEach(clue => {
      if (!clue.enabled) return;
      clue_counts[clue.value] = (clue_counts[clue.value] || 0) + 1;
    });
  });

  return clue_counts;
}

var Board = props => {
  var board = props.board;
  var cells = board[0];

  var clue_counts = calculateClueCounts(board);

  /**
   * Find first category with an enabled clue at the given index.
   */
  function getClue (clueIndex) {
    var metaClue = {
      categoryIndex: null,
      clue: null,
    };

    board.every((category, i) => {
      var clue = category[clueIndex];
      if (clue.enabled) {
        metaClue.categoryIndex = i;
        metaClue.clue = assign({}, clue, {index: clueIndex});
      }
      return metaClue.categoryIndex === null;
    });

    return metaClue;
  }

  var defaultFound = false;
  function autoFocus (i) {
    if (defaultFound) return false;
    defaultFound = ((i + 1) / cells.length) >= 0.5;
    return defaultFound;
  }

  var el = (
    <div id="board" className="enabled">

    <ul className="column">
    {cells.map((clue, i) => {
      var clue_count = clue_counts[clue.value];
      return <Cell
        {...clue} clue_value={clue.value}
        label={clue.value} key={clue.value} index={i} autoFocus={autoFocus(i)}
        clue_count={props.display_clue_counts ? clue_count : undefined}
        openClue={clue_count > 0 ? props.openClue : null}
        getClue={getClue}
      />
    })}
    </ul>
    {/* .column */}

    </div>
  );

  if (KeyboardNav) {
    el = (
      <KeyboardNav>
        {el}
      </KeyboardNav>
    );
  }

  return el;
};

Board.displayName = "Board";

Board.propTypes = {
  board: function (props, key, component) {
    var board = props[key];

    // Temporarily disable this pending figuring out how to deal with them
    // breaking ability to call prop type methods.
    const enableArrayCheck = false

    var err = enableArrayCheck && PropTypes.array.isRequired(props, key, component, "prop");

    if (err) {
      return err;
    }

    if (!board.length) {
      return Error("There are no categories");
    }
  },
  display_clue_counts: PropTypes.bool,
};

module.exports = Board;
