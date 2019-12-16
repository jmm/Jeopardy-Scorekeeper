"use strict";

var EndRound = require("app/component/presentational/dialog/end-round");
var ReactRedux = require("react-redux");

function mapStateToProps (state) {
  return {
    round: state.rounds.slice(-1)[0].number,
  };
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

const mapDispatchToProps = actionCreators.static;

var Connected = ReactRedux.connect(
  mapStateToProps, mapDispatchToProps
)(EndRound);

module.exports = Connected;
