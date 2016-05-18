"use strict";

var assign = require("object-assign");
var DialogPlayer = require("../dialog-player");
var KeyboardNav = require("../keyboard-nav");
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
      onClick={e =>
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
      onClick={e =>
        props.processResponse(assign({
          responseType: "skip",
        }, clueResponse))
      }
    ><span className="label">Skip</span></button>

    <button
      className="button wrong" type="button"
      onClick={e =>
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
      <button className="button daily-double" type="button" onClick={e => {
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

var DialogClue = React.createClass({
  render () {
    return render.call(this, this.props);
  },

  componentDidMount: autoFocus,
  componentDidUpdate: autoFocus,
});

DialogClue.displayName= "DialogClue";

DialogClue.propTypes = {
  clue: (propTypes =>
    assign(React.PropTypes.shape(propTypes).isRequired, {propTypes})
  )({
    id: React.PropTypes.number.isRequired,
    categoryId: React.PropTypes.number.isRequired,
    value: React.PropTypes.number.isRequired,
    players: React.PropTypes.array.isRequired,
  }),

  current_player: React.PropTypes.number.isRequired,
  players: React.PropTypes.array.isRequired,
  processResponse: React.PropTypes.func.isRequired,
  openDailyDouble: React.PropTypes.func,
  close: React.PropTypes.func.isRequired,
};

module.exports = DialogClue;
