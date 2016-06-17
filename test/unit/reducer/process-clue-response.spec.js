"use strict";

var _ = require("lodash");
var assign = Object.assign;
var reduce = require("app/reducer/process-clue-response");
var sinon = require("sinon");
var test = require("tape");
var update = require("react-addons-update");
var upperCaseKeys = require("app/util/upper-case-keys");

var desc;

/**
 * Get the specified clue from the current round.
 * @param object state State object containing clue data.
 * @param object clue Hash describing clue {categoryId, id}.
 * @return object clue
 */
function getClue (state, clue) {
  return state.rounds.slice(-1)[0].board
    [clue.categoryId]
    [clue.id];
}

var clue = {
  value: 600,
  enabled: true,
};

var baseState = {
  deduct_incorrect_clue: true,
  rounds: [
    {
      board: [[clue]]
    }
  ],
  players: [
    {
      id: 1,
      score: 1000,
    },

    {
      id: 2,
      score: 2000,
    },
  ],
  current_player: 0,
  current_clue: {
    players: [],
  }
};

var baseAction = {
  type: "PROCESS_CLUE_RESPONSE",
  payload: {
    responseType: "right",
    categoryId: 0,
    id: 0,
    playerId: 0,
  },
};

// For each action type a function that generates the payload this reducer is
// expected to send to the action handler reducer.
var payloads = upperCaseKeys({
  sanitize_score: function (state, action) {
    return undefined;
  },

  change_player_score: function (state, action) {
    return {
      index: action.payload.playerId,
      score:
        state.players[action.payload.playerId].score +
        getClue(state, action.payload).value,
    };
  },

  finish_clue: function (state, action) {
    return action.payload;
  },

  set_current_player: function (state, action) {
    return {index: action.payload.playerId};
  },
});

var actionTypes = {};

actionTypes.sanitize_score= function (state, action) {
  return state;
};

actionTypes.change_player_score = function (state, action) {
  state = update(state, {
    players: {
      0: {
        score: {$set: action.payload.score}
      }
    }
  });

  return state;
};

actionTypes.finish_clue = function (state, action) {
  state = update(state, {
    rounds: {
      0: {
        board: {
          0: {
            0: {
              enabled: {$set: false},
            }
          }
        }
      }
    }
  });

  return state;
};

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

var suiteDesc = "reducer/process-clue-response : ";

test(suiteDesc + "Correctly invokes sub reducer(s)", function (t) {
  spy.reset();

  var action = baseAction;
  var state = reduce(baseState, action);

  var keys = Object.keys(actionTypes);

  t.equal(
    spy.callCount,
    keys.length,
    "Sub reducers called correct number of times"
  );

  spy.args.forEach(function (args, i) {
    var subReduceCall = _.zipObject(["state", "action"], args);

    i = keys.indexOf(subReduceCall.action.type);
    t.equal(
      keys.splice(keys.indexOf(subReduceCall.action.type), 1).length,
      1,
      "Action type is in expected set"
    );

    t.deepEqual(
      subReduceCall.action.payload,
      payloads[subReduceCall.action.type](baseState, action),
      `Correct payload for action.type ${subReduceCall.action.type}`
    );
  });

  t.equal(keys.length, 0, "All expected action types were invoked.");

  t.end();
});

desc = suiteDesc + "Correctly processes correct response by current player";
test(desc, function (t) {
  var state = reduce(baseState, baseAction);

  t.notEqual(state, baseState, "Didn't mutate input state");

  t.equal(
    state.current_player,
    baseState.current_player,
    "Didn't change player"
  );

  t.equal(
    state.players[state.current_player].score,

    actionTypes.CHANGE_PLAYER_SCORE(baseState, update(baseAction, {
      payload: {
        score: {$set:
          baseState.players[baseState.current_player].score + clue.value
        }
      }
    }))
    .players[baseState.current_player].score,

    "Score is correctly updated"
  );

  t.equal(
    getClue(state, baseAction.payload).enabled,
    false,
    "Clue is disabled"
  );

  t.end();
});

desc = suiteDesc + "Changes to non-current player with correct response";
test(desc, function (t) {
  var original = {
    CHANGE_PLAYER_AFTER_CLUE: actionTypes.CHANGE_PLAYER_AFTER_CLUE,
  };

  actionTypes.CHANGE_PLAYER_AFTER_CLUE = function (state, action) {
    state = assign({}, state, {
      current_player: action.payload.playerId,
    });

    return state;
  };

  var action = update(baseAction, {
    payload: {
      playerId: {$set: 1},
    }
  });

  t.notEqual(
    baseState.current_player,
    action.payload.playerId,
    "Payload player is not current"
  );

  var state = reduce(baseState, action);

  t.notEqual(state, baseState, "Didn't mutate input state");

  t.equal(
    state.current_player,
    action.payload.playerId,
    "Changed current_player to payload player"
  );

  t.equal(
    state.players[state.current_player].score,

  actionTypes.CHANGE_PLAYER_SCORE(state, baseAction)
  .players[state.current_player].score,

    "Score is correctly updated"
  );

  t.equal(
    getClue(state, action.payload).enabled,
    false,
    "Clue is disabled"
  );

  actionTypes.CHANGE_PLAYER_AFTER_CLUE =
    original.CHANGE_PLAYER_AFTER_CLUE;

  t.end();
});

test(suiteDesc + "Doesn't prematurely disable clue", function (t) {
  var action = update(baseAction, {
    payload: {
      responseType: {$set: "wrong"},
    }
  });
  var state = reduce(baseState, action);

  t.equal(
    getClue(state, baseAction.payload).enabled,
    true,
    "Clue is still enabled"
  );

  t.end();
});

test(suiteDesc + "Disables clue when players are exhausted", function (t) {
  var state = baseState;

  baseState.players.forEach((player, i, arr) => {
    var action = update(baseAction, {
      payload: {
        playerId: {$set: i},
        responseType: {$set: "wrong"},
      }
    });

    state = reduce(state, action);

    var expected = i < arr.length - 1;

    t.equal(
      getClue(state, action.payload).enabled,
      expected,
      `Clue has correct enablement: ${expected}`
    );
  });

  t.end();
});

test(suiteDesc + "Finishes designated daily doubles", function (t) {
  var state = baseState;

  var action = update(baseAction, {
    payload: {
      playerId: {$set: 0},
      responseType: {$set: "wrong"},
      clue: {$set: {
        dailyDouble: true,
      }},
    }
  });

  state = reduce(state, action);

  t.equal(
    getClue(state, action.payload).enabled,
    false,
    "Clue is disabled"
  );

  t.end();
});

test(suiteDesc + "Finishes promoted daily doubles", function (t) {
  var state = baseState;

  var action = update(baseAction, {
    payload: {
      playerId: {$set: 0},
      responseType: {$set: "wrong"},
      dailyDouble: {$set: true},
    }
  });

  state = reduce(state, action);

  t.equal(
    getClue(state, action.payload).enabled,
    false,
    "Clue is disabled"
  );

  t.end();
});

desc = suiteDesc +
  "Emits correct score for deductable incorrect promoted daily double";

test(desc, function (t) {
  var state = update(baseState, {
    deduct_incorrect_clue: {$set: false},
    deduct_incorrect_daily_double: {$set: true},
  });

  var action = update(baseAction, {
    payload: {
      playerId: {$set: 0},
      responseType: {$set: "wrong"},
      dailyDouble: {$set: true},
      clue: {$set: {
        enabled: true,
        value: 600,
      }},
    }
  });

  state = reduce(state, action);

  t.equal(
    state.players[action.payload.playerId].score,

    baseState.players[action.payload.playerId].score -
      action.payload.clue.value,

    "New player score is correct"
  );

  t.end();
});

desc = suiteDesc +
  "Emits correct score for deductable incorrect natural daily double";

test(desc, function (t) {
  var state = update(baseState, {
    deduct_incorrect_clue: {$set: false},
    deduct_incorrect_daily_double: {$set: true},
    rounds: {
      0: {
        board: {
          0: {
            0: {
              dailyDouble: {$set: true}
            }
          }
        }
      }
    }
  });

  var action = update(baseAction, {
    payload: {
      playerId: {$set: 0},
      responseType: {$set: "wrong"},
      clue: {$set: state.rounds[0].board[0][0]},
    }
  });

  state = reduce(state, action);

  t.equal(
    state.players[action.payload.playerId].score,

    baseState.players[action.payload.playerId].score -
      action.payload.clue.value,

    "New player score is correct"
  );

  t.end();
});
