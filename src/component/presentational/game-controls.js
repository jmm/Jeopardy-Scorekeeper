"use strict";

var Cfg = require("app/component/connected/cfg");
var PropTypes = require('prop-types');
var React = require("react");

var GameControls = props =>
  <div className="column" id="game-controls">
    {
      ! props.rounds.length ?

      <div id="setup-game">
        <div id="start-game-controls">
          {
            props.resumeGame ?

            <div>
              <button
                className="button" id="resume-game" type="button"
                onClick={props.resumeGame}
              ><span className="label">Resume Previous Game</span></button>
            </div>

            :

            null
          }

          <div>
            <button
              className="button" id="start-game" type="button"
              onClick={props.advanceRound}
              disabled={!props.players.length}
            ><span className="label">New Game</span></button>
          </div>
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
  rounds: PropTypes.arrayOf(PropTypes.object).isRequired,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
  advanceRound: PropTypes.func.isRequired,
  endRound: PropTypes.func.isRequired,
  endGame: PropTypes.func.isRequired,
  resumeGame: PropTypes.func,
};

module.exports = GameControls;
