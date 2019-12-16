"use strict";

var PropTypes = require('prop-types');

var React = require("react");
var Player = require("app/component/connected/player");

function Players (props) {
  return (
    <div id="players">
      {(props.players || []).map((player, i) =>
        <Player index={i} key={i} />
      )}
    </div>
  );
}

Players.propTypes = {
  players: PropTypes.array,
  current_player: PropTypes.number,
};

module.exports = Players;
