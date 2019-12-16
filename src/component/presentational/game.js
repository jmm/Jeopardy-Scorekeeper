"use strict";

var CurrentClue = require("app/component/connected/game-current-clue");
var GameControls = require("app/component/connected/game-controls");
var Board = require("app/component/connected/board");
var dialogs = require("app/component/connected/dialog");
var Players = require("app/component/connected/players");
var PropTypes = require('prop-types');
var React = require("react");

var Game = props => {
  var children;

  if (props.ui.dialog_stack.length) {
    var dialog = props.ui.dialog_stack.slice(-1)[0];
    dialog.component = dialogs[dialog.type];
    children = <dialog.component
      {...dialog.props}
    />;
  }
  else if (props.current_clue) {
    children = <CurrentClue />;
  }
  else if (props.rounds.length === props.total_rounds) {
    children = <dialogs.FinalJeopardy />;
  }
  else {
    var roundLabel = "";

    if (props.rounds.length) {
      roundLabel = (props.round_names || {})[props.rounds.length - 1];
      roundLabel = roundLabel ?
        `${roundLabel} Jeopardy` :
        `Round #${props.rounds.length}`;
    }

    var horizontalBoard =
      typeof matchMedia !== "undefined" &&
      matchMedia(`
        (orientation: landscape) and
        (max-height: 719px)
      `).matches;

    children = [];
    children.push(
      <GameControls key="game-controls" />
    );

    children.push(
      <div
        className={horizontalBoard ? null : "column"}
        id="board-container"
        key="board-container"
      >
        {props.rounds.length ? <Board /> : null}
      </div>
    );

    // If display is in landscape mode with insufficient vertical dimension the
    // board cells will be switched to a horizontal rather than vertical layout.
    // In that case, display the board first (top).
    // TODO:JMM something better to use than vertical pixel dimension?
    if (horizontalBoard) {
      children.reverse();
    }

    children = <div>
      {children}

      <div className="column" id="round-and-players">
        <div className="section" id="section-round">
          <h1 className="primary-section-heading">
          {roundLabel}
          </h1>
        </div>
        {/* #section-round */}


        <div className="section" id="section-players">
          <h1 className="primary-section-heading">
            Contestants
          </h1>

          <Players />

          <div className={`add-player ${props.rounds.length ? "" : "enabled"}`}>
            <a href="" onClick={props.handleAddPlayer}>Add Contestant</a>
          </div>
        </div>
        {/* #section-players */}
      </div /* .column#round-and-players */>
    </div>.props.children;
  }

  return (
    <div
      id="game"
      className={horizontalBoard ? "horizontal-board" : ""}
    >
      {children}
    </div>
  );
};

Game.displayName = "Game";

Game.propTypes = {
  ui: PropTypes.shape({
    dialog_stack: PropTypes.array.isRequired,
  }).isRequired,
  rounds: PropTypes.array.isRequired,
  total_rounds: PropTypes.number.isRequired,
  current_clue: PropTypes.object,
  handleAddPlayer: PropTypes.func.isRequired,
  round_names: PropTypes.array,
};

module.exports = Game;
