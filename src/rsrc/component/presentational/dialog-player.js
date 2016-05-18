"use strict";

var assign = require("object-assign");
var Player = require("app/model/player");
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
  index: React.PropTypes.number.isRequired,
  player: (propTypes =>
    assign(React.PropTypes.shape(propTypes).isRequired, {propTypes})
  )({
    score: React.PropTypes.number.isRequired,
  }),
};

module.exports = DialogPlayer;
