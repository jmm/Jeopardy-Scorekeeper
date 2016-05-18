"use strict";

var assign = Object.assign;
var game = require("app/reducer/game");
var reduce = require("app/reducer/advance-round");
var sinon = require("sinon");
var test = require("tape");
var update = require("react-addons-update");
var upperCaseKeys = require("app/util/upper-case-keys");

var actionTypes = {};
actionTypes.set_current_player = function (state, action) {
  state = assign({}, state, {
    current_player: action.payload.index,
  });
  return state;
};

upperCaseKeys(actionTypes);

function subReduce (state, action) {
  return actionTypes[action.type](state, action);
}

var spy = subReduce = sinon.spy(subReduce);

reduce = reduce.factory({
  getReducer: () => subReduce,
});

var baseState = game.factory().reducer();

var suiteDesc = "reducer/advance-round : ";
var desc;

test(suiteDesc + "Base game state is correct", function (t) {
  t.ok(Array.isArray(baseState.rounds), "state.rounds is an array");
  t.equal(baseState.rounds.length, 0, "state.rounds is empty");
  t.equal(baseState.current_player, null, "No current player");

  t.end();
});

test(suiteDesc + "Increments to non-final round correctly", function (t) {
  var state = reduce(baseState, {
    type: "ADVANCE_ROUND",
  });

  t.equal(state.current_player, null, "Doesn't set current player");

  t.notEqual(state, baseState, "Doesn't mutate state input");
  t.equal(state.rounds.length, baseState.rounds.length + 1, "Adds a round");

  var round = state.rounds[state.rounds.length - 1];
  t.equal(
    round.max_clue_value,
    baseState.base_clue_value * baseState.category_length,
    "Has correct round.max_clue_value"
  );

  t.equal(
    round.dailyDoubles,
    state.rounds.length,
    "Has correct daily double count"
  );

  t.equal(
    round.board.length,
    baseState.num_categories,
    "Board has correct number of categories"
  );

  t.end();
});

test(suiteDesc + "Uses custom board", function (t) {
  var action = {
    type: "ADVANCE_ROUND",
    payload: {
      board: [[,,,]],
    }
  };

  var state = reduce(assign({}, baseState, {
    num_categories: 18,
    category_length: 50,
  }), action);

  t.equal(
    state.rounds[state.rounds.length - 1].board.length,
    action.payload.board.length,
    "Has custom board length"
  );

  t.equal(
    state.rounds[state.rounds.length - 1].board[0].length,
    action.payload.board[0].length,
    "Has custom board category length"
  );

  t.end();
});

test(suiteDesc + "Uses custom daily double count", function (t) {
  var action = {
    type: "ADVANCE_ROUND",
    payload: {
      dailyDoubles: 0,
    }
  };
  var state = reduce(baseState, action);

  t.equal(
    state.rounds[state.rounds.length - 1].dailyDoubles,
    action.payload.dailyDoubles,
    "Has custom daily double count"
  );

  t.end();
});

test(suiteDesc + "Uses custom number of categories", function (t) {
  var num_categories = 10;
  var state = reduce(assign({}, baseState, {
    num_categories,
  }), {
    type: "ADVANCE_ROUND",
  });

  t.equal(
    state.rounds[state.rounds.length - 1].board.length,
    num_categories,
    "Has custom number of categories"
  );

  t.end();
});

test(suiteDesc + "Uses custom category_length", function (t) {
  var category_length = 21;
  var state = reduce(assign({}, baseState, {
    category_length,
  }), {
    type: "ADVANCE_ROUND",
  });

  t.equal(
    state.rounds[state.rounds.length - 1].board[0].length,
    category_length,
    "Has custom category_length"
  );

  t.end();
});

test(suiteDesc + "Uses default current player", function (t) {
  var payload = {
    default_current_player: 1,
  };
  var state = reduce(baseState, {
    type: "ADVANCE_ROUND",
    payload,
  });

  t.equal(
    state.current_player,
    payload.default_current_player,
    "Correctly set default current player"
  );

  t.end();
});

[
  {
    change_round_player_method: -1,
    desc: "Changes player",
    new_player_desc: "Made lowest scored player current",
  },
  {
    change_round_player_method: 1,
    desc: "Changes player",
    new_player_desc: "Made highest scored player current",
  },
  {
    change_round_player_method: 0,
    desc: "Doesn't change player",
    new_player_desc: "Didn't change current_player",
  },
].forEach(spec => {
  desc =
    `${suiteDesc} ${spec.desc} [change_round_player_method: ${spec.change_round_player_method}]`;

  test(desc, function (t) {
    spy.reset();
    var state;
    // If testing change to highest scored player, start with lowest scored
    // player (index 1) as current.
    var currentPlayer = spec.change_round_player_method === 1 ? 1 : 0;
    var newPlayer = currentPlayer - spec.change_round_player_method;

    state = update(baseState, {
      players: {$set: [
        {
          score: 200,
        },
        {
          score: 100,
        },
      ]},
      change_round_player_method: {$set: spec.change_round_player_method},
    });

    // Advance to round 1
    state = reduce(state, {
      type: "ADVANCE_ROUND",
    });

    state = update(state, {
      current_player: {$set: currentPlayer},
    });

    state = reduce(state, {
      type: "ADVANCE_ROUND",
    });

    t.equal(
      spy.callCount,
      Math.abs(spec.change_round_player_method),
      `Sub reducer ${spec.change_round_player_method ? "" : "not"} called`
    );

    t.equal(
      state.current_player,
      newPlayer,
      spec.new_player_desc
    );

    t.end();
  });
});
