"use strict";

module.exports = Player;

function Player (state = {}, opts = {}) {
  if (!(this instanceof Player)) return new Player(state, opts);
  this.state = state;
  this.opts = opts;
}

Player.prototype.constructor = Player;

/**
 * Return name suitable for display. E.g. computed value when not specified.
 */
Player.prototype.getDisplayName = function () {
  return this.state.name != null ?
    this.state.name :
    "Contestant " + (this.opts.index + 1);
};
