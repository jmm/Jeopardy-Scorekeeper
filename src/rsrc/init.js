"use strict";

var assign = require("object-assign");
var createStore = require("app/store/game");
var GameContainer = require("app/component/connected/game");
var React = require("react");
var ReactRedux = require("react-redux");

exports.init = init;

function init () {
  var store = createStore();

  var state = store.getState();

  if (!state.players.length) {
    store.dispatch({
      type: "ADD_PLAYERS",
      payload: {
        players: [{}]
      }
    });
  }

  return {
    store,

    element: (
      <ReactRedux.Provider store={store}>
        <GameContainer />
      </ReactRedux.Provider>
    ),
  };
}
// init
