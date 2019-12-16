"use strict";

const {assign} = Object;
var EndGame = require("app/component/presentational/dialog/end-game");
var persistence = require("app/persistence");
var ReactRedux = require("react-redux");
var Redux = require("redux");

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

function endGame () {
  persistence.local.remove();
}

function mergeProps (stateProps, dispatchProps, ownProps) {
  return assign(
    {endGame},
    stateProps,
    dispatchProps,
    ownProps
  );
}

var actionDispatchers = {};

var actionCreators = {};

// These don't depend on state.
actionCreators.static = {
  close () {
    return {
      type: "CLOSE_DIALOG",
    };
  },
};

var Connected = ReactRedux.connect(
  undefined, mapDispatchToProps, mergeProps
)(EndGame);

module.exports = Connected;
