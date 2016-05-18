"use strict";

var reduce = require("app/reducer/change-player-name").reducer;
var test = require("tape");
var update = require("react-addons-update");

var baseState = {
  players: [
    {
      name: null,
    },
  ],
};

var baseAction = {
  type: "CHANGE_PLAYER_NAME",
  payload: {
    index: 0,
    name: null,
  },
};

var suiteDesc = "reducer/change-player-name : ";

test(suiteDesc + "Updates name", function (t) {
  var action = update(baseAction, {
    payload: {
      name: {$set: "X"}
    }
  });

  var state = reduce(baseState, action);

  t.notEqual(state, baseState, "Didn't mutate input state");

  t.equal(
    state.players[action.payload.index].name,
    action.payload.name,
    "Updated player name"
  );

  t.end();
});
