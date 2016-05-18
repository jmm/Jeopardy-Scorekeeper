"use strict";

var assign = require("object-assign");
var React = require("react");

function handleClick (e) {
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
  label: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]).isRequired,

  clue_count: React.PropTypes.number,

  openClue: React.PropTypes.func,
};

module.exports = Cell;
