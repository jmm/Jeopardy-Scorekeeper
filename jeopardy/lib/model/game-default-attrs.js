/**
 * Default attributes for model/game.
 * This file was created so that both model/game and other models can utiliize
 * it without cyclic dependency issues. Revisit this when there's time to look
 * into that more and see if there's not a legit way to export this from
 * model/game early enough to make it work.
 */
export default {
  // Deduct value of incorrect regular clue responses?
  deduct_incorrect_clue: true,

  // Deduct value of incorrect Daily Double responses?
  deduct_incorrect_daily_double: true,

  // min|max
  // min: player with lowest score gets control
  // max: player with highest score gets control
  change_round_player_method: 'min',

  /// number Minimum regular clue value for round 1.
  base_clue_value: 200,

  players: [{}],

  // Including Final Jeopardy
  total_rounds: 3,

  /// int Number of players in a Jeopardy TV episode.
  num_tv_players: 3,

  /// number Categories per round.
  num_categories: 6,

  // number Clues per category
  category_length: 5,

  /// number Minimum daily double wager.
  min_daily_double_wager: 5,

  /// number Minimum regular clue value.
  min_clue_value: 200,
};
