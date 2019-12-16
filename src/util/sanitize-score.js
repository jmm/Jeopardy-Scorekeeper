"use strict";

function sanitizeScore (score) {
  let sanitizedScore = score

  if (typeof sanitizedScore === 'string') {
    sanitizedScore = (sanitizedScore.trim().match(/^[0-9-]+/) || [""])[0];
  }
  else if (typeof sanitizedScore !== "number") sanitizedScore = 0;

  sanitizedScore = Math.round(sanitizedScore);

  if (isNaN(sanitizedScore)) {
    sanitizedScore = 0;
  }

  return sanitizedScore;
}

module.exports = {sanitizeScore};
