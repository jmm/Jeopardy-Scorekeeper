"use strict";

/* General deps */
var assign = require("object-assign");
var reducerUtil = require("app/reducer-util");
var upperCaseKeys = require("app/util/upper-case-keys");
var util = require("util");

/* Slice reducers */
var ui = require("app/reducer/ui/index");

/* Action reducers */
const process_clue_response = require("app/reducer/process-clue-response");
const process_daily_double_response =
  require("app/reducer/process-daily-double-response");
const add_players = require("app/reducer/add-players");
const delete_player = require("app/reducer/delete-player");
const change_player_name = require("app/reducer/change-player-name");
const change_player_score = require("app/reducer/change-player-score");
const set_current_player = require("app/reducer/set-current-player");
const change_config = require("app/reducer/change-config");
const advance_round = require("app/reducer/advance-round");
const open_clue = require("app/reducer/open-clue");
const close_clue = require("app/reducer/close-clue");
const finish_clue = require("app/reducer/finish-clue");
const promote_current_clue = require("app/reducer/promote-current-clue");
const demote_current_clue = require("app/reducer/demote-current-clue");
const sanitize_score = require("app/reducer/sanitize-score");
const normalize_daily_double_wager =
  require("app/reducer/normalize-daily-double-wager");
const player_change_score = require("app/reducer/player-change-score");

var reducers = {};

reducers.detached = upperCaseKeys({
  sanitize_score,
  player_change_score,
  normalize_daily_double_wager,
});

reducers.actions = upperCaseKeys({
  process_clue_response,
  process_daily_double_response,
  add_players,
  delete_player,
  change_player_name,
  change_player_score,
  set_current_player,
  change_config,
  advance_round,
  open_clue,
  close_clue,
  finish_clue,
  promote_current_clue,
  demote_current_clue,
});

reducers.slices = {
  ui,
};

function factory (opts) {
  var original = opts.original;
  original = original && original.reducer;
  return function (state, action) {
    return original(state, action);
  };
}

module.exports = reducerUtil.factory(assign({
  factory,
  state: {
    deduct_incorrect_clue: true,
    deduct_incorrect_daily_double: true,
    min_daily_double_wager: 5,
    base_clue_value: 200,
    category_length: 5,
    num_categories: 6,
    total_rounds: 3,
    num_tv_players: 3,
    players: [],
    // Means has control of the board.
    current_player: null,
    current_clue: null,
    change_round_player_method: -1,
    rounds: [],
    round_names: [
      "Single",
      "Double",
      "Final",
    ],
    ui: undefined,
  },
}, reducers));
