"use strict";

const {assign} = Object;
var FinalJeopardy =
  require("app/component/presentational/dialog/final-jeopardy");
var ReactRedux = require("react-redux");
var Redux = require("redux");
const {sanitizeScore} = require("app/util/sanitize-score");

function mapStateToProps (state) {
  return {
    num_tv_players: state.num_tv_players,
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

function mergeProps (state, dispatch, own) {
  return assign({
    sanitizeScore,
  }, own, dispatch, state);
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
};

function openDialog (opts) {
  return {
    type: "OPEN_DIALOG",
    payload: opts,
  };
}

var Connected = ReactRedux.connect(
  mapStateToProps, mapDispatchToProps, mergeProps
)(FinalJeopardy);

module.exports = Connected;
