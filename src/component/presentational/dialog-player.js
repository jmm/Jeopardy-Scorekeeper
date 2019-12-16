"use strict";

const {assign} = Object;
var Player = require("app/model/player");
const PropTypes = require('prop-types');
var React = require("react");

function DialogPlayer (props) {
  var model = Player(props.player, {index: props.index});
  return (
    <p className="current-player">
    Current player: {model.getDisplayName()} ${props.player.score}
    </p>
  );
}

DialogPlayer.displayName = "DialogPlayer";

DialogPlayer.propTypes = {
  index: PropTypes.number.isRequired,
  player: (propTypes =>
    assign(PropTypes.shape(propTypes).isRequired, {propTypes})
  )({
    score: PropTypes.number.isRequired,
  }),
};

module.exports = DialogPlayer;
