"use strict";

var assign = require("object-assign");
var EndGame = require("app/component/presentational/dialog/end-game");
var React = require("react");
var ReactRedux = require("react-redux");
var Redux = require("redux");

function mapDispatchToProps (dispatch, props) {
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
  close () {
    return {
      type: "CLOSE_DIALOG",
    };
  },
};

var Connected = ReactRedux.connect(
  undefined, mapDispatchToProps
)(EndGame);

module.exports = Connected;
