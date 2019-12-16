"use strict";

var PropTypes = require('prop-types');

var React = require("react");

function handleClick () {
  var props = this.props;
  var metaClue = props.getClue(props.index);

  props.openClue({
    payload: {
      categoryId: metaClue.categoryIndex,
      id: props.index,
      dailyDouble: metaClue.dailyDouble,
    }
  });
}
// handleClick

var Cell = props =>
  <li className={`cell ${props.openClue ? "enabled" : ""}`}>

  <button className="button" type="button"
    onClick={props.openClue && handleClick.bind({props})}
    autoFocus={props.autoFocus}
  ><span className="label">${props.label} {
    props.clue_count ?
    <span className="count">({props.clue_count})</span> :
    ""
  }</span></button>

  </li>
;

Cell.displayName = "Cell";

Cell.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,

  clue_count: PropTypes.number,
  openClue: PropTypes.func,
  autoFocus: PropTypes.bool,
};

module.exports = Cell;
