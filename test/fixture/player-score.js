"use strict";

module.exports = {
  keys: ["desc", "actual", "expected"],

  items: [
    ["undefined", void 0, 0],
    ["null", null, 0],
    ["string", "100", 100],
    ["empty string", "", 0],
    ["padded string", " 100 ", 100],
    ["float", "100.123", 100],
    ["negative", -100, -100],
    ["negative string", "-100", -100],
    ["NaN", NaN, 0],
    ["false", false, 0],
  ]
};
