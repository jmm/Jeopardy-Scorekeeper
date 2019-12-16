"use strict";

const {assign} = Object;
const PropTypes = require('prop-types');
var React = require("react");

function BooleanParam (props) {
  const htmlId = `config-${props.id.replace(/_/g, "-")}`

  return (
    <div className="data-item data-field control-set">
      <div className="label-block">
        <label htmlFor={htmlId}>{props.label}</label>
      </div>

      <div className="control-block">
        <select
          name={`config[${props.id}]`} id={htmlId}
          value={props.value ? "1" : "0"} onChange={e => {
            props.changeConfig({
              param: props.id,
              value: Boolean(Number(e.target.value) || 0),
              type: "boolean",
            });
          }}
        >
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>
      </div>
      {/* .control-block */}
    </div>
  );
}

BooleanParam.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.bool,
  changeConfig: PropTypes.func.isRequired,
};

var Cfg = props =>
  <form id="game-config" autoComplete="off">
    <h1>
      Configuration
    </h1>

    <BooleanParam
      {...props}
      label="Deduct on incorrect regular clues"
      id="deduct_incorrect_clue"
      value={props.deduct_incorrect_clue}
    />

    <BooleanParam
      {...props}
      label="Deduct on incorrect Daily Doubles"
      id="deduct_incorrect_daily_double"
      value={props.deduct_incorrect_daily_double}
    />

    <div className="data-item data-field control-set">
      <div className="label-block">
        <label htmlFor="config-double-jeopardy-change-player-method">Who starts Double Jeopardy</label>
      </div>

      <div className="control-block">
        <select
          name="config[double_jeopardy_change_player_method]"
          id="config-double-jeopardy-change-player-method"
          value={String(props.change_round_player_method)} onChange={e => {
            props.changeConfig({
              param: "change_round_player_method",
              value: e.target.value,
              type: "integer",
            });
          }}
        >
          <option value="-1">Lowest Score</option>
          <option value="0">Current Player</option>
          <option value="1">Highest Score</option>
        </select>
      </div>
      {/* .control-block */}
    </div>
    {/* .data-item */}

    <BooleanParam
      changeConfig={props.changeConfig}
      label="Display clue counts on board"
      id="display_clue_counts"
      value={props.ui.display_clue_counts}
    />
  </form>
;

Cfg.propTypes = {
  deduct_incorrect_clue: PropTypes.bool.isRequired,
  deduct_incorrect_daily_double: PropTypes.bool.isRequired,
  change_round_player_method: PropTypes.number.isRequired,
  changeConfig: PropTypes.func.isRequired,

  ui: (propTypes =>
    assign(PropTypes.shape(propTypes).isRequired, {propTypes})
  )({
    display_clue_counts: PropTypes.bool,
  }),
};

module.exports = Cfg;
