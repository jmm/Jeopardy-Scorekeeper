"use strict";

var createStore = require("app/store/game");
var GameContainer = require("app/component/connected/game");
var persistence = require("app/persistence");
var React = require("react");
var ReactRedux = require("react-redux");

exports.init = init;

function init () {
  var store = createStore();

  store.subscribe(function () {
    var state = store.getState();

    if (!state.rounds.length) return;

    // Save state to local storage in case of inadvertent navigation away from
    // page / refresh / crash.
    persistence.local.set(store.getState());
  });

  var state = store.getState();

  if (!state.players.length) {
    store.dispatch({
      type: "ADD_PLAYERS",
      payload: {
        players: [{}]
      }
    });
  }

  const DevTools = process.env.NODE_ENV === "production"
    ? undefined
    : require("app/component/dev-tools").DevTools

  return {
    store,

    element: (
      <ReactRedux.Provider store={store}>
        <div>
          <GameContainer />
          {DevTools && <DevTools />}
        </div>
      </ReactRedux.Provider>
    ),
  };
}
// init
