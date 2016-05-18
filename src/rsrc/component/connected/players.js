"use strict";

var assign = require("object-assign");
var Players = require("app/component/presentational/players");
var React = require("react");
var ReactRedux = require("react-redux");
var Redux = require("redux");

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
