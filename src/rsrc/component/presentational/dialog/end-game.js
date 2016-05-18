"use strict";

var KeyboardNav = require("../keyboard-nav");
var React = require("react");

KeyboardNav = KeyboardNav();

var EndGame = props => {
  var el = (
    <div className="dialog" id="dialog-end-round">

    <div className="prompt">
    Are you sure you want to end the game?
    </div>

    <a className="button yes" href=""><span className="label">Yes</span></a>

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

EndGame.displayName = "EndGame";

EndGame.propTypes = {
  close: React.PropTypes.func.isRequired,
};

module.exports = EndGame;
