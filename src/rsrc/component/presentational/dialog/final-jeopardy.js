"use strict";

var assign = require("object-assign");
var createReactComponentClass =
  require("app/util/create-react-component-class");
var KeyboardNav = require("../keyboard-nav");
var keyboardNavCfg =
  require("./final-jeopardy-keyboard-nav");
var React = require("react");

KeyboardNav = KeyboardNav(keyboardNavCfg);

function calculateFinalScore (opts) {
  var {sanitizeScore} = opts.props;
  var score = sanitizeScore(
    (opts.state.score != null ? opts.state : opts.props).score
  );
  if (score < 0) return score;
  return score + (
    Math.min(score, sanitizeScore(opts.state.wager)) * (
      opts.state.correct ? 1 : -1
    )
  );
}

function autoFocus () {
  this.autoFocusEl.focus();
}

function render (props) {
  var el = (
    <tr className="player">
      <th scope="row">
        {
          props.live !== false ?
          props.name :
          <input
            type="text"
            name={`player[${props.id}][name]`}
            value={this.state.name || props.name}
            onChange={this.handleNameChange}
            size="12"
          />
        }
      </th>

      <td scope="col" className="score before numeric">
        {props.score}
      </td>

      <td scope="col" className="score before numeric">
        <input
          type="number"
          name={`player[${props.id}][score]`}
          value={this.state.score || ""}
          size="8"
          onChange={this.handleScoreChange}
        />
      </td>

      <td scope="col" className="wager numeric">
        <input
          type="number"
          name={`player[${props.id}][wager]`}
          value={this.state.wager || ""}
          size="8"
          ref={props.autoFocusEl}
          onChange={this.handleWagerChange}
        />
      </td>

      <td scope="col" className="correct">
        <label className="right"><input
          type="checkbox"
          name={`player[${props.id}][correct]`}
          value="1"
          onChange={this.handleCorrectChange}
          checked={this.state.correct}
        /></label>
      </td>

      <td scope="col" className="score after numeric">
        {this.state.wager != null && calculateFinalScore({
          props,
          state: this.state,
        })}
      </td>
    </tr>
  );

  return el;
}

var Player = React.createClass({
  render () {
    return render.call(this, this.props)
  },

  handleNameChange (e) {
    this.setState({name: e.target.value});
  },

  handleScoreChange (e) {
    this.setState({
      score: /\d/.test(e.target.value) ? e.target.value : null
    });
  },

  handleWagerChange (e) {
    this.setState({
      wager: /\d/.test(e.target.value) ? e.target.value : null
    });
  },

  handleCorrectChange (e) {
    this.setState({correct: e.target.checked});
  },

  getInitialState () {
    return {
      score: null,
      wager: null,
    };
  }
});

var superKlass = React.Component;

var FinalJeopardy = createReactComponentClass({
  constructor: function (props) {
  },

  render: function () {
    var props = this.props;

    var tvPlayers = [];
    for (
      let i = 1;
      i <= props.num_tv_players;
      ++i
    ) {
      tvPlayers.push({
        name: "TV Player " + i,
        live: false,
      });
    }

    var el = (
      <div className="dialog" id="dialog-final-jeopardy">
        <div className="prompt">
          Final Jeopardy
        </div>

        <form id="final-jeopardy-form" autoComplete="off">
          <table className="players-table">
            <thead>
              <tr>
                <th scope="col" className="player">
                  Contestant
                </th>

                <th scope="col" className="score original numeric">
                  Original Score
                </th>

                <th scope="col" className="score before numeric">
                  Score Override
                </th>

                <th scope="col" className="wager numeric">
                  Wager
                </th>

                <th scope="col" className="correct">
                  Correct
                </th>

                <th scope="col" className="score after numeric">
                  Final Score
                </th>
              </tr>
            </thead>

            <tbody className="players">
              {props.players.concat(tvPlayers).map((player, i) => {
                return <Player
                  {...player} id={i} key={i}
                  sanitizeScore={props.sanitizeScore}
                  autoFocusEl={i ? null : (ref) => this.autoFocusEl = ref}
                />;
              })}
            </tbody>
          </table>

          <div className="dialog-control">
            <button
              type="button" className="button close enabled"
              onClick={props.endGame}
            ><span className="label">End Game</span></button>
          </div>
        </form>
      </div>
    );

    el = (
      <KeyboardNav>
        {el}
      </KeyboardNav>
    );

    return el;
  },
  // render

  componentDidMount: autoFocus,
  componentDidUpdate: autoFocus,
});

FinalJeopardy.displayName = "FinalJeopardy";

FinalJeopardy.propTypes = {
  num_tv_players: React.PropTypes.number.isRequired,
  players: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  sanitizeScore: React.PropTypes.func.isRequired,
  endGame: React.PropTypes.func.isRequired,
};

module.exports = FinalJeopardy;
