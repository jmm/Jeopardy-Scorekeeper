"use strict";

const {assign} = Object;
const {reducer: set_current_player} = require("app/reducer/set-current-player");

function advance_round (state, action) {
  action.payload = action.payload || {};
  var round_number = state.rounds.length + 1;
  if (round_number > state.total_rounds) return state;

  state = assign({}, state);

  if (
    state.current_player == null &&
    action.payload.default_current_player != null
  ) {
    state.current_player = action.payload.default_current_player;
  }
  else if (round_number > 1 && state.change_round_player_method) {
    let method = state.change_round_player_method;
    let newPlayer = state.players.reduce((prev, curr, i, players) => {
      if (
        method === -1 && curr.score < players[prev].score ||
        method === 1 && curr.score > players[prev].score
      ) {
        return i;
      }
      else return prev;
    }, 0);

    state = set_current_player(state, {
      type: "SET_CURRENT_PLAYER",
      payload: {
        index: newPlayer,
      }
    })
  }

  var round = {
    number: round_number,
  };
  var final = round.number === state.total_rounds;

  round.board = action.payload.board;

  if (!(round.board || final)) {
    round.board = [];
    round.dailyDoubles = action.payload.dailyDoubles != null ?
      action.payload.dailyDoubles:
      round.number
    ;

    for (let i = 1; i <= state.num_categories; ++i) {
      let clues = [];

      for (let i = 1; i <= state.category_length; ++i) {
        clues.push({
          enabled: true,
          value: state.base_clue_value * i * round.number,
        });
      }

      round.board.push(clues);
    }

    round.max_clue_value = round.board[0].slice(-1)[0].value;
  }

  state.rounds = [...state.rounds, round];

  return state;
}

module.exports = {reducer: advance_round};
