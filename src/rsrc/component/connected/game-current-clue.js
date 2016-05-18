"use strict";

var assign = require("object-assign");
var GameCurrentClue = require("app/component/presentational/game-current-clue");
var React = require("react");
var ReactRedux = require("react-redux");
var Redux = require("redux");

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
