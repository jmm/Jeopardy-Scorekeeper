"use strict";

var KeyboardNav = require("../keyboard-nav");
var React = require("react");

KeyboardNav = KeyboardNav();

var EndRound = props => {
  var el = (
    <div className="dialog" id="dialog-end-round">

    <div className="prompt">
    Are you sure you want to end round #{props.round}?
    </div>

    <button
      className="button yes" type="button" onClick={props.endRound}
    ><span className="label">Yes</span></button>

    <button
      className="button no" type="button" onClick={props.close}
      autoFocus
    ><span className="label">Cancel</span></button>

    </div>
  );

  el = (
    <KeyboardNav>
      {el}
    </KeyboardNav>
  );

  return el;
};

EndRound.displayName = "EndRound";

EndRound.propTypes = {
  round: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]).isRequired,
  endRound: React.PropTypes.func.isRequired,
  close: React.PropTypes.func.isRequired,
};

module.exports = EndRound;
