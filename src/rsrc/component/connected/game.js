"use strict";

var assign = require("object-assign");
var Game = require("app/component/presentational/game");
var React = require("react");
var ReactRedux = require("react-redux");
var Redux = require("redux");

// Do real selection in mergeProps().
function mapStateToProps (state) {
  return state;
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
    {
      ui: {
        dialog_stack: stateProps.ui.dialog_stack,
        display_clue_counts: stateProps.ui.display_clue_counts,
      },
      rounds: stateProps.rounds,
      min_daily_double_wager: stateProps.min_daily_double_wager,
      current_clue: stateProps.current_clue,
      total_rounds: stateProps.total_rounds,
      round_names: stateProps.round_names,
    },
    dispatchProps,
    ownProps
  );
}

var actionDispatchers = {};

var actionCreators = {};

// These don't depend on state.
actionCreators.static = {
  handleAddPlayer (e) {
    e.preventDefault();
    return {
      type: "ADD_PLAYERS",
      payload: {
        players: [{}],
      },
    };
  },
};

module.exports = ReactRedux.connect(
  mapStateToProps, mapDispatchToProps, mergeProps
)(Game);
