"use strict";

var assign = require("object-assign");
var EndRound = require("app/component/presentational/dialog/end-round");
var React = require("react");
var ReactRedux = require("react-redux");
var Redux = require("redux");
var reduxUtils = require("app/util/redux-utils");

function mapStateToProps (state) {
  return {
    round: state.rounds.slice(-1)[0].number,
  };
}

function mapDispatchToProps (dispatch, props) {
  return assign(
    {dispatch},

    reduxUtils.boundActionCreatorsCache.get({
      componentPath: __filename,
      dispatch,
      actionCreators: actionCreators.static,
    })
  );
}

var actionCreators = {};

// These don't depend on state.
actionCreators.static = {
  endRound () {
    return {
      type: "ADVANCE_ROUND",
    };
  },

  close () {
    return {
      type: "CLOSE_DIALOG",
    };
  },
};

var Connected = ReactRedux.connect(
  mapStateToProps, mapDispatchToProps
)(EndRound);

module.exports = Connected;
