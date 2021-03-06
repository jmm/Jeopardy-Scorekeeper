"use strict";

const {assign} = Object;
var Player = require("app/component/presentational/player");
const PropTypes = require('prop-types');
var ReactRedux = require("react-redux");

// See mergeProps() for real selection logic.
function mapStateToProps (state) {
  return state;
}

function mergeProps (state, dispatch, own) {
  dispatch = assign({}, dispatch);

  if (state.rounds.length) delete dispatch.delete;
  if (state.players.length <= 1) delete dispatch.takeControl;

  state = assign({
    hasControl: own.index === state.current_player,
  }, state.players[own.index]);

  return assign({}, own, state, dispatch);
}

var actionCreators = {};

// These don't depend on state.
actionCreators.static = {
  delete (opts) {
    return {
      type: "DELETE_PLAYER",
      payload: {
        index: opts.index,
      },
    };
  },

  takeControl (opts) {
    return {
      type: "SET_CURRENT_PLAYER",
      payload: {
        index: opts.index,
      },
    };
  },

  changeName (player, name) {
    return {
      type: "CHANGE_PLAYER_NAME",
      payload: {
        index: player,
        name,
      }
    };
  },

  changeScore (player, score) {
    return {
      type: "CHANGE_PLAYER_SCORE",
      payload: {
        index: player,
        score,
      }
    };
  },
};

const mapDispatchToProps = actionCreators.static;

var Connected = ReactRedux.connect(
  mapStateToProps, mapDispatchToProps, mergeProps
)(Player);

Connected.propTypes = {
  index: PropTypes.number.isRequired,
};

module.exports = Connected;
