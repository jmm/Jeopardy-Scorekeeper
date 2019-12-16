"use strict";

const {assign} = Object;
var createReactComponentClass =
  require("app/util/create-react-component-class");
var DialogPlayer = require("../dialog-player");
var KeyboardNav = require("../keyboard-nav");
var keyboardNavCfg = require("./daily-double-keyboard-nav");
const PropTypes = require('prop-types');
var React = require("react");

KeyboardNav = KeyboardNav(keyboardNavCfg);

function noop () {}

function nullWagerOnChange (e) {
  var target = e.target;
  if (target.checked) {
    // Give time for the change event on target to finish processing and
    // setting wager so that selecting the custom wager input can
    // override it.
    setTimeout(function () {
      target.closest(".data-field")
      .querySelector("input[type=number]")
      .select();
    }, 10);
  }
}

/**
 * Return an element representing a wager type.
 * @param object props Props
 *   string opts.id Wager type.
 *   bool opts.autoFocus Wager type. Apply autoFocus attr?
 *   function opts.selectedClass Return CSS class for selected status.
 *   string opts.label Label text.
 *   number opts.wager Wager amount.
 *
 * @return ReactElement
 */
function WagerType (props) {
  var {
    autoFocus,
    selected,
    id,
    label,
    wager,
    setWagerData
  } = props;

  // When appropriate provide a noop just to silence React's warning. `change`
  // events are actually handled by the parent component. See
  // https://github.com/facebook/react/issues/1118
  var onChange = wager == null ? nullWagerOnChange : noop;

  return (
    <div
      key={id}
      className={`
        data-field control-set data-field-wager wager-${id}
        ${selected ? "selected" : ""}
      `}
    >
      <label><input
        type="radio" name="wager" value={wager} autoFocus={autoFocus}
        checked={selected}
        data-wager-type={id}
        onChange={onChange}
      /> {label}: {
        wager != null ?
        <span className="wager">${wager}</span> :
        ""
      }</label>

      {
        wager ?
        "" :
        <span>
          $<input
            type="number" name="custom_wager" id="custom-wager" size="8"
            onFocus={e => {
              setWagerData({
                wagerType: "custom",
                wager: e.target.value,
              })
            }}

            onChange={e => {
              setWagerData({
                wager: e.target.value,
              })
            }}
          />
        </span>.props.children
      }
    </div>
  );
}

WagerType.propTypes = {
  autoFocus: PropTypes.bool,
  selected: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  wager: PropTypes.number,
  setWagerData: PropTypes.func.isRequired,
};

var DailyDoubleDialog = createReactComponentClass({
  constructor: function (props) {
    this.state = {
      wager: props.clue.value,
      wagerType: "natural",
    };
  },

  render: function () {
    var props = this.props;

    var setWagerData = data => {
      this.setState(data);
    }

    var handleWagerChange = e => {
      if (e.target.type !== "radio") return;
      setWagerData({
        wager: e.target.value,
        wagerType: e.target.dataset.wagerType,
      });
    };

    var response = {
      categoryId: props.clue.categoryId,
      id: props.clue.id,
      clue: props.clue,
      playerId: props.current_player,
      wager: this.state.wager,
    };

    var handleWagerNav = e => {
      return handle_wager_nav.call(this, e);
    }

    var el = (
      <div
        className="dialog" id="dialog-daily-double"
        onFocus={handleWagerNav}
        onBlur={handleWagerNav}
        onClick={handleWagerNav}
        onChange={handleWagerChange}
      >
        <div className="prompt">
          Daily Double
        </div>

        <DialogPlayer
          player={props.players[props.current_player]}
          index={props.current_player}
        />

        <form
          id="wager-form" autoComplete="off"
          onSubmit={e => e.preventDefault()}
        >
          {[
            {
              id: "minimum",
              label: "Minimum",
            },

            {
              id: "natural",
              label: "Natural Clue Value",
              autoFocus: true,
              wager: props.clue.value,
            },

            {
              id: "maximum",
              label: "Maximum Clue Value",
              include:
                props.wagers.maximum > props.players[props.current_player].score,
            },

            {
              id: "true",
              label: "True Daily Double",
              wager: props.players[props.current_player].score,
              include: props.players[props.current_player].score > 0,
            },

            {
              id: "custom",
              label: "Custom",
            },
          ].map(wagerEl =>
            wagerEl.include === false ?
            null :
            <WagerType
              {...wagerEl}
              key={wagerEl.id}
              selected={this.state.wagerType === wagerEl.id}
              setWagerData={setWagerData}
              wager={wagerEl.wager || props.wagers[wagerEl.id]}
            />
          )}
        </form>

        <button className="button right" type="button"
          onClick={() => {
            props.processResponse(assign({
              responseType: "right",
            }, response))
          }}
        ><span className="label">Right</span></button>

        <button className="button skip" type="button"
          onClick={() =>
            props.processResponse(assign({
              responseType: "skip",
            }, response))
          }
        ><span className="label">Skip</span></button>

        <button
          className="button wrong" type="button"
          onClick={() =>
            props.processResponse(assign({
              responseType: "wrong",
            }, response))
          }
        ><span className="label">Wrong</span></button>

        <button className="button cancel" type="button" onClick={() => {
          props.cancel();
        }}><span className="label">Cancel</span></button>
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
});

DailyDoubleDialog.displayName = "DialogDailyDouble";

DailyDoubleDialog.propTypes = {
  clue: (propTypes =>
    assign(PropTypes.shape(propTypes).isRequired, {propTypes})
  )({
    id: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }),

  current_player: PropTypes.number.isRequired,
  players: PropTypes.array.isRequired,
  processResponse: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,

  wagers: (propTypes =>
    assign(PropTypes.shape(propTypes).isRequired, {propTypes})
  )({
    minimum: PropTypes.number.isRequired,
    maximum: PropTypes.number.isRequired,
  }),
};

/**
 * Highlight the selected / focused wager type.
 *
 * @param obj event
 */
function handle_wager_nav (event) {
  if (!event.target.matches("input[type=radio]")) return;

  var event_cfg = {
    click: {class: 'selected', toggle: true},
    focus: {class: 'focused', toggle: true},
    blur: {class: 'focused', toggle: false},
  }[event.type];

  // Get the container of the current input.
  var data_field = event.target.closest(".data-field");

  if (!data_field) return;

  data_field.classList.toggle(event_cfg.class, event_cfg.toggle);
}
// handle_wager_click

module.exports = DailyDoubleDialog;
