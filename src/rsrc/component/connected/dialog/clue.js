"use strict";

var assign = require("object-assign");
var Clue = require("app/component/presentational/dialog/clue");
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

function mergeProps (state, dispatch, own) {
  dispatch = assign({}, dispatch);
  if (!own.dailyDoublesLive) {
    delete dispatch.openDailyDouble;
  }
  return assign({}, own, dispatch, state);
}

var actionDispatchers = {};

var actionCreators = {};

// These don't depend on state.
actionCreators.static = {
  processResponse (opts) {
    return {
      type: "PROCESS_CLUE_RESPONSE",
      payload: opts,
    };
  },

  openDailyDouble () {
    return {
      type: "PROMOTE_CURRENT_CLUE"
    };
  },

  close (opts) {
    return assign({
      type: "CLOSE_CLUE",
    }, opts);
  },
};

var Connected = ReactRedux.connect(
  undefined, mapDispatchToProps, mergeProps
)(Clue);

Connected.propTypes = {
  dailyDoublesLive: React.PropTypes.bool,
};

module.exports = Connected;
