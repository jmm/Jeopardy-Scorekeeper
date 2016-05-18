/*
Handles rendering when the main UI is a clue (regular or daily double, but not
final Jeopardy).
*/
"use strict";

var assign = require("object-assign");
var Clue = require("app/component/connected/dialog/clue");
var DailyDouble = require("app/component/connected/dialog/daily-double");
var React = require("react");

var CurrentClue = props => {
  var el;

  let round = props.rounds.slice(-1)[0];
  let clue = assign(
    round.board
    [props.current_clue.categoryId]
    [props.current_clue.id],

    props.current_clue
  );

  var Component = Clue;
  var childProps = {};

  // A clue may be designated a daily double or may be promoted on the fly.
  if (clue.dailyDouble || props.current_clue.dailyDouble) {
    Component = DailyDouble;
  }
  else {
    childProps.dailyDoublesLive = !!round.dailyDoubles;
  }

  el = <Component
    clue={clue}
    current_player={props.current_player}
    players={props.players}
    {...childProps}
  />;

  return el;
};

CurrentClue.displayName = "CurrentClue";

CurrentClue.propTypes = {
  rounds: React.PropTypes.array.isRequired,
  current_clue: (propTypes =>
    assign(React.PropTypes.shape(propTypes).isRequired, {propTypes})
  )({
    id: React.PropTypes.number.isRequired,
    categoryId: React.PropTypes.number.isRequired,
    dailyDouble: React.PropTypes.bool,
  }),
  current_player: React.PropTypes.number.isRequired,
  players: React.PropTypes.array.isRequired,
};

module.exports = CurrentClue;
