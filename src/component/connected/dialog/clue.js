"use strict";

const {assign} = Object;
var Clue = require("app/component/presentational/dialog/clue");
const PropTypes = require('prop-types');
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
  dailyDoublesLive: PropTypes.bool,
};

module.exports = Connected;
