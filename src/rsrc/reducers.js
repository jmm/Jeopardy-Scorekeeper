"use strict";

var game = require("app/reducer/game");

// Top level reducers, e.g. corresponding to state or a top-level prop.
// reducers.game corresponds to the whole state.
// reducers[other] corresponds to the prop of the same name.
var reducers = {};

reducers.game = game;

module.exports = reducers;
