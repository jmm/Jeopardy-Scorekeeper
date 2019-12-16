"use strict";

const {assign} = Object;
var GameControls = require("app/component/presentational/game-controls");
var persistence = require("app/persistence");
var ReactRedux = require("react-redux");
var Redux = require("redux");

function mapStateToProps (state) {
  return {
    rounds: state.rounds,
    players: state.players,
  };
}

function mapDispatchToProps (dispatch) {
  if (
    Object.keys(actionCreators.static).length >
    Object.keys(actionDispatchers).length
  ) {
    actionDispatchers = Redux.bindActionCreators(
      actionCreators.static, dispatch
    );
  }

  return assign(
    {dispatch},
    actionDispatchers
  );
}

function mergeProps (stateProps, dispatchProps, ownProps) {
  return assign(
    {},
    stateProps,
    dispatchProps,
    actionCreators.dynamic(dispatchProps.dispatch, stateProps),
    ownProps
  );
}

var actionDispatchers = {};

var actionCreators = {};

// These don't depend on state.
actionCreators.static = {
  endGame () {
    return openDialog({
      type: "EndGame",
    });
  },

  endRound () {
    return openDialog({
      type: "EndRound",
    });
  },

  advanceRound (opts = {}) {
    return {
      type: "ADVANCE_ROUND",
      payload: opts.payload,
    };
  },
};

function openDialog (opts) {
  return {
    type: "OPEN_DIALOG",
    payload: opts,
  };
}

// These depend on state.
actionCreators.dynamic = function (dispatch, state) {
  var creators = {};

  // If not already set, set current player for first round randomly.
  if (!(state.rounds.length || state.current_player)) {
    creators.advanceRound = function () {
      var payload = {
        default_current_player: Math.floor(
          Math.random() * state.players.length
        ),
      };

      return actionCreators.static.advanceRound({payload});
    };
  }

  var savedGame = persistence.local.get();

  if (savedGame) {
    creators.resumeGame = function () {
      return {
        type: "HYDRATE",
        payload: {
          state: savedGame,
        },
      }
    };
  }

  return Redux.bindActionCreators(creators, dispatch);
};

module.exports = ReactRedux.connect(
  mapStateToProps, mapDispatchToProps, mergeProps
)(GameControls);
