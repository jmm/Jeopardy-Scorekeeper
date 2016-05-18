"use strict";

var reduce = require("app/reducer/delete-player").reducer;
var test = require("tape");
var update = require("react-addons-update");

var baseState = {
  players: [
    {name: "One"},
    {name: "Two"},
    {name: "Three"},
  ],
  current_player: 1,
};

var baseAction = {
  type: "DELETE_PLAYER",
  payload: {},
};

var suiteDesc = "reducer/delete-player : ";

test(suiteDesc + "Deletes player", function (t) {
  var action = update(baseAction, {
    payload: {
      index: {$set: baseState.current_player},
    }
  });

  var state = reduce(baseState, action);

  t.notEqual(state, baseState, "Didn't mutate input state");

  t.equal(
    state.players.length,
    baseState.players.length - 1,
    "Deleted a player"
  );

  var players = [].concat(baseState.players);
  players.splice(action.payload.index, 1);

  t.deepEqual(state.players, players, "Deleted correct player");

  t.equal(
    state.current_player,
    action.payload.index ===
      baseState.current_player ? null : baseState.current_player,

    "Reset current_player"
  );

  t.end();
});
