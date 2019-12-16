"use strict";

const {assign} = Object;
var Cfg = require("app/component/presentational/cfg");
var ReactRedux = require("react-redux");
var Redux = require("redux");

function mapStateToProps (state) {
  var props = {};
  [
    "deduct_incorrect_clue",
    "deduct_incorrect_daily_double",
    "change_round_player_method",
    "changeConfig",
  ].forEach(key => {
    props[key] = state[key];
  });

  props.ui = {
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
  changeConfig (opts) {
    return {
      type: "CHANGE_CONFIG",
      payload: opts,
    };
  },
};

module.exports = ReactRedux.connect(
  mapStateToProps, mapDispatchToProps
)(Cfg);
