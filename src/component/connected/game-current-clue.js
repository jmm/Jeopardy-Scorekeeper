"use strict";

var GameCurrentClue = require("app/component/presentational/game-current-clue");
var ReactRedux = require("react-redux");

function mapStateToProps (state) {
  var props = {
    rounds: state.rounds,
    current_clue: state.current_clue,
    current_player: state.current_player,
    players: state.players,
  };

  return props;
}

module.exports = ReactRedux.connect(
  mapStateToProps
)(GameCurrentClue);
