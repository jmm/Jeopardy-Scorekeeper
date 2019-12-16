"use strict";

const {assign} = Object;
var DialogPlayer = require("../dialog-player");
var KeyboardNav = require("../keyboard-nav");
const PropTypes = require('prop-types');
var React = require("react");

KeyboardNav = KeyboardNav();

function render (props) {
  var clueResponse = {
    categoryId: props.clue.categoryId,
    id: props.clue.id,
    clue: props.clue,
    playerId: props.current_player,
  };

  var cancelable = !props.clue.players.length;

  var el = (
    <div className="dialog" id="dialog-clue">

    <div className="prompt">
    ${props.clue.value}
    </div>

    <DialogPlayer
      player={props.players[props.current_player]}
      index={props.current_player}
    />

    <button
      className="button right" type="button"
      onClick={() =>
        props.processResponse(assign({
          responseType: "right",
        }, clueResponse))
      }
    ><span className="label">Right</span></button>

    <button
      className="button skip" type="button" autoFocus
      ref={el => {
        this.autoFocusEl = el;
      }}
      onClick={() =>
        props.processResponse(assign({
          responseType: "skip",
        }, clueResponse))
      }
    ><span className="label">Skip</span></button>

    <button
      className="button wrong" type="button"
      onClick={() =>
        props.processResponse(assign({
          responseType: "wrong",
        }, clueResponse))
      }
    ><span className="label">Wrong</span></button>

    <button
      className={`
        button cancel
        ${cancelable ? "" : "disabled"}
      `} type="button"
      onClick={e => {
        if (cancelable) props.close();
        else {
          this.autoFocusEl = e.target;
          setTimeout(autoFocus.bind(this), 10);
        }
      }}
    ><span className="label">Cancel</span></button>

    {props.openDailyDouble ?
      <button className="button daily-double" type="button" onClick={() => {
        return props.openDailyDouble();
      }}><span className="label">Daily Double</span></button> :
      null
    }
    </div>
  );

  if (KeyboardNav) {
    el = (
      <KeyboardNav>
        {el}
      </KeyboardNav>
    );
  }

  return el;
}
// render

function autoFocus () {
  this.autoFocusEl.focus();
}

const DialogClue = class extends React.Component {
  render () {
    return render.call(this, this.props);
  }
};

assign(DialogClue.prototype, {
  componentDidMount: autoFocus,
  componentDidUpdate: autoFocus,
});

DialogClue.displayName= "DialogClue";

DialogClue.propTypes = {
  clue: (propTypes =>
    assign(PropTypes.shape(propTypes).isRequired, {propTypes})
  )({
    id: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    players: PropTypes.array.isRequired,
  }),

  current_player: PropTypes.number.isRequired,
  players: PropTypes.array.isRequired,
  processResponse: PropTypes.func.isRequired,
  openDailyDouble: PropTypes.func,
  close: PropTypes.func.isRequired,
};

module.exports = DialogClue;
