"use strict";

var assign = require("object-assign");
var CurrentClue = require("app/component/connected/game-current-clue");
var GameControls = require("app/component/connected/game-controls");
var Board = require("app/component/connected/board");
var FinalJeopardy = require("app/component/connected/dialog/final-jeopardy");
var Players = require("app/component/connected/players");
var React = require("react");
var update = require("react-addons-update");

var Game = props => {
  var children;

  if (props.ui.dialog_stack.length) {
    var Dialog = props.ui.dialog_stack.slice(-1)[0];
    children = <Dialog.component
      {...Dialog.props}
    />;
  }
  else if (props.current_clue) {
    children = <CurrentClue />;
  }
  else if (props.rounds.length === props.total_rounds) {
    children = <FinalJeopardy />;
  }
  else {
    var roundLabel = "";

    if (props.rounds.length) {
      roundLabel = (props.round_names || {})[props.rounds.length - 1];
      roundLabel = roundLabel ?
        `${roundLabel} Jeopardy` :
        `Round #${props.rounds.length}`;
    }

    children = <div>
      <GameControls />

      <div className="column" id="column-board">
        {props.rounds.length ? <Board /> : null}
      </div>

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
    <div id="game">
      {children}
    </div>
  );
};

Game.displayName = "Game";

Game.propTypes = {
  ui: React.PropTypes.shape({
    dialog_stack: React.PropTypes.array.isRequired,
  }).isRequired,
  rounds: React.PropTypes.array.isRequired,
  total_rounds: React.PropTypes.number.isRequired,
  current_clue: React.PropTypes.object,
  handleAddPlayer: React.PropTypes.func.isRequired,
  round_names: React.PropTypes.array,
};

module.exports = Game;
