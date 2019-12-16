"use strict";

var Players = require("app/component/presentational/players");
var ReactRedux = require("react-redux");

function mapStateToProps (state) {
  var props = {
    players: state.players,
    current_player: state.current_player,
  };

  return props;
}

module.exports = ReactRedux.connect(
  mapStateToProps
)(Players);
