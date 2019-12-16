/*
Handles rendering when the main UI is a clue (regular or daily double, but not
final Jeopardy).
*/
"use strict";

const {assign} = Object;
var Clue = require("app/component/connected/dialog/clue");
var DailyDouble = require("app/component/connected/dialog/daily-double");
const PropTypes = require('prop-types');
var React = require("react");

var CurrentClue = props => {
  var el;

  let round = props.rounds.slice(-1)[0];
  let clue = assign(
    round.board[props.current_clue.categoryId][props.current_clue.id],
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
  rounds: PropTypes.array.isRequired,
  current_clue: (propTypes =>
    assign(PropTypes.shape(propTypes).isRequired, {propTypes})
  )({
    id: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    dailyDouble: PropTypes.bool,
  }),
  current_player: PropTypes.number.isRequired,
  players: PropTypes.array.isRequired,
};

module.exports = CurrentClue;
