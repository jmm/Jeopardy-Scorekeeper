"use strict";

const {makeReducer} = require("app/util");
var upperCaseKeys = require("app/util/upper-case-keys");

const {reducer: uiReducer} = require("app/reducer/ui/index");
const {reducer: process_clue_response} = require("app/reducer/dvr/process-clue-response");
const {reducer: process_daily_double_response} = require("app/reducer/process-daily-double-response");
const {reducer: add_players} = require("app/reducer/add-players");
const {reducer: delete_player} = require("app/reducer/delete-player");
const {reducer: change_player_name} = require("app/reducer/change-player-name");
const {reducer: change_player_score} = require("app/reducer/change-player-score");
const {reducer: set_current_player} = require("app/reducer/set-current-player");
const {factory: change_config_factory} = require("app/reducer/change-config");
const {reducer: advance_round} = require("app/reducer/advance-round");
const {reducer: open_clue} = require("app/reducer/open-clue");
const {reducer: close_clue} = require("app/reducer/close-clue");
const {reducer: finish_clue} = require("app/reducer/finish-clue");
const {reducer: promote_current_clue} = require("app/reducer/promote-current-clue");
const {reducer: demote_current_clue} = require("app/reducer/demote-current-clue");
const {reducer: normalize_daily_double_wager} =
  require("app/reducer/normalize-daily-double-wager");
const {reducer: player_change_score} = require("app/reducer/player-change-score");

const change_config = change_config_factory({
  whitelist: [
    "change_round_player_method",
    "deduct_incorrect_clue",
    "deduct_incorrect_daily_double",
  ],
});

const reducers = {
  actions: upperCaseKeys({
    player_change_score,
    normalize_daily_double_wager,
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
  }),

  slices: {
    ui: uiReducer,
  },
};

const defaultState = {
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
};

const reducer = makeReducer({
  defaultState,
  ...reducers,
});

module.exports = {reducer};
