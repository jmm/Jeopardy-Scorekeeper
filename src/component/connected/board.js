"use strict";

const {assign} = Object;
var Board = require("app/component/presentational/board");
var ReactRedux = require("react-redux");
var Redux = require("redux");

function mapStateToProps (state) {
  var props = {
    board: state.rounds.slice(-1)[0].board,
    display_clue_counts: state.ui.display_clue_counts,
  };

  return props;
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

var actionDispatchers = {};

var actionCreators = {};

// These don't depend on state.
actionCreators.static = {
  openClue (opts) {
    return {
      type: "OPEN_CLUE",
      payload: opts.payload,
    };
  },
};

module.exports = ReactRedux.connect(
  mapStateToProps, mapDispatchToProps
)(Board);
