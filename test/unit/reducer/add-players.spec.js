"use strict";

var gameReducer = require("app/reducer/game").reducer;
var reduce = require("app/reducer/add-players").reducer;
var test = require("tape");
var update = require("react-addons-update");

var fixtures = {
  players: [
    {name: "One"},
    {name: "Two"},
    {name: "Three"},
  ],
};

var desc;
var baseState = gameReducer();

var baseAction = {
  type: "ADD_PLAYERS",
  payload: {},
};

var suiteDesc = "reducer/add-players : ";

test(suiteDesc + "Base game state is correct", function (t) {
  t.ok(Array.isArray(baseState.players), "state.players is an array");
  t.equal(baseState.players.length, 0, "state.players is empty");

  t.end();
});

/**
 * Run logic common to variations on adding players.
 * @param object opts
 *   array opts.newPlayers Players to add
 *   object opts.state State to reduce. Defaults to baseState.
 *
 * @return object state Reduced state.
 */
function testAddPlayers (opts) {
  var {
    newPlayers,
    state = baseState,
    t,
  } = opts;

  var totalPlayers = state.players.concat(newPlayers);

  state = reduce(state, update(baseAction, {
    payload: {
      players: {$set: newPlayers}
    }
  }));

  t.notEqual(state, baseState, "Input state isn't mutated");
  t.equal(
    state.players.length,
    totalPlayers.length,
    `state.players has expected length: ${totalPlayers.length}`
  );
  totalPlayers.forEach((player, i) => t.equal(
    state.players[i],
    player,
    `state.players[${i}] has expected value`
  ));

  if (opts.end !== false) t.end();

  return state;
}

desc = suiteDesc + "Adds single player to empty collection correctly";
test(desc, function (t) {
  testAddPlayers({
    newPlayers: fixtures.players.slice(0, 1),
    t,
  });
});

desc = suiteDesc + "Adds multiple players to empty collection correctly";
test(desc, function (t) {
  testAddPlayers({
    newPlayers: fixtures.players.slice(1),
    t,
  });
});

desc = suiteDesc + "Adds single player to non-empty collection correctly";
test(desc, function (t) {
  var state = testAddPlayers({
    newPlayers: fixtures.players.slice(1),
    t,
    end: false,
  });

  testAddPlayers({
    state,
    newPlayers: fixtures.players.slice(0, 1),
    t,
  });
});

desc = suiteDesc + "Adds multiple players to non-empty collection correctly";
test(desc, function (t) {
  var state = testAddPlayers({
    newPlayers: fixtures.players.slice(0, 1),
    t,
    end: false,
  });

  testAddPlayers({
    state,
    newPlayers: fixtures.players.slice(1),
    t,
  });
});
