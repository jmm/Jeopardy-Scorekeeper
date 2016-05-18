"use strict";

var Model = require("app/model/player");
var React = require("react");

/**
 * Wrap input[type=number] so that negative values can be entered.
 *
 * Otherwise the interaction between browser and React is dysfunctional when a
 * leading `-` is entered.
 *
 * Proxies value through state to track user input and only calls change
 * callback once there's a value it can understand.
 */
var NumberWrapper = React.createClass({
  getInitialState () {
    return {
      value: this.props.children.props.value,
    };
  },

  componentWillReceiveProps (props) {
    this.setState({value: props.children.props.value});
  },

  render () {
    var props = this.props;

    return React.cloneElement(props.children, {
      value: this.state.value,
      onChange: e => {
        var value = e.target.value;
        this.setState({value});
        if (value !== "") props.children.props.onChange(e);
      }
    })
  },
});

var Player = props => {
  var model = Model(props, {index: props.index});

  return (
    <div
      className={`player ${
        props.hasControl ?
        "has-control" :
        ""
      }`}
      id={`player-${props.index}`}
      onFocus={e => {
        if (e.target.tagName.toLowerCase() === "input") {
          e.target.select();
        }
      }}
    >
      <div className="name">
        <input
          type="text" name="player[][name]" className="name"
          value={model.getDisplayName()}
          onChange={e => {
            props.changeName(props.index, e.target.value);
          }}
          onBlur={e => {
            if (props.name === "") props.changeName(props.index, null);
          }}
        />
      </div>


      <div className="score">
        $<NumberWrapper><input
          type="number" name="player[][score]" className="score"
          value={props.score}
          onChange={e => {
            props.changeScore(props.index, e.target.value);
          }}
        /></NumberWrapper>
      </div>

      {props.delete &&
        <div
          className="delete enabled"
        ><a href="" onClick={e => {
          e.preventDefault();
          props.delete({
            index: props.index,
          });
        }}>Delete Contestant</a></div>
      }

      {props.takeControl &&
        <div
          className="set-has-control enabled"
        ><a href="" onClick={e => {
          e.preventDefault();
          props.takeControl({
            index: props.index,
          })
        }}>Make Current</a></div>
      }
    </div>
  );
};

Player.displayName = "Player";

Player.propTypes = {
  takeControl: React.PropTypes.func,
  delete: React.PropTypes.func,
  changeName: React.PropTypes.func.isRequired,
  changeScore: React.PropTypes.func.isRequired,
  name: React.PropTypes.string,
  score: React.PropTypes.number.isRequired,
  index: React.PropTypes.number.isRequired,
  hasControl: React.PropTypes.bool,
};

module.exports = Player;
