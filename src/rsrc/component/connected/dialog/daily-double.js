"use strict";

var assign = require("object-assign");
var DailyDouble = require("app/component/presentational/dialog/daily-double");
var React = require("react");
var ReactRedux = require("react-redux");
var Redux = require("redux");

function mapStateToProps (state) {
  var props = {
    wagers: {
      minimum: state.min_daily_double_wager,
      maximum: state.rounds.slice(-1)[0].max_clue_value,
    },
  };

  return props;
}

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
  cancel () {
    return {
      type: "DEMOTE_CURRENT_CLUE"
    };
  },

  processResponse (opts) {
    return {
      type: "PROCESS_DAILY_DOUBLE_RESPONSE",
      payload: assign({
      }, opts),
    };
  },
};

module.exports = ReactRedux.connect(
  mapStateToProps, mapDispatchToProps
)(DailyDouble);
