var reducer = require("../reducer/sanitize-score").reducer;

module.exports = sanitize_score;

function sanitize_score (score) {
  return reducer(score, {type: "SANITIZE_SCORE"});
}
