"use strict";

var Cfg = require("app/component/connected/cfg");
var React = require("react");

var GameControls = props =>
  <div className="column" id="game-controls">

  {
    ! props.rounds.length ?

    <div id="setup-game">

    <div id="greater-start-game">
    <button
      className="button" id="start-game" type="button"
      onClick={props.advanceRound}
      disabled={!props.players.length}
    ><span className="label">Start Game</span></button>
    </div>

    </div>

    :

    <div id="admin-game">

    <div id="greater-end-round">
    <button
      id="end-round" className="button" type="button"
      onClick={props.endRound}
    ><span className="label">End Round</span></button>
    </div>

    <div id="greater-end-game">
    <button
      id="end-game" className="button" type="button"
      onClick={props.endGame}
    ><span className="label">End Game</span></button>
    </div>


    <div id="daily-doubles-remaining">
    Daily Doubles Remaining: <span className="count">{props.rounds.slice(-1)[0].dailyDoubles}</span>
    </div>

    </div>
  }

  <Cfg />

  </div>
;

GameControls.propTypes = {
  rounds: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  players: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  advanceRound: React.PropTypes.func.isRequired,
  endRound: React.PropTypes.func.isRequired,
  endGame: React.PropTypes.func.isRequired,
};

module.exports = GameControls;
