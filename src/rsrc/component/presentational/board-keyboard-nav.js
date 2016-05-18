"use strict";

var keyboardNav = {handlers: {}};

/**
 * Handle keyboard input.
 * @param obj event
 */
keyboardNav.handlers.input = function (event) {
  // Certain keyboard events don't need to be handled specifically for this
  // view.
  if (this.handlers.keypress(event)) {
    return;
  }
  // if

  /* Map various keys to corresponding navigation movements. */
  var nav_keys = {};

  nav_keys[this.key_values.Up] = "Up";
  nav_keys["z".charCodeAt(0)] = "Up";
  nav_keys["Z".charCodeAt(0)] = "Up";

  nav_keys[this.key_values.Down] = "Down";
  nav_keys["x".charCodeAt(0)] = "Down";
  nav_keys["X".charCodeAt(0)] = "Down";

  // Map some navigation movements to corresponding DOM properties.
  var nav_events = {Up: "previous", Down: "next"};
  Object.keys(nav_events).forEach(key => nav_events[key] += "ElementSibling");

  var nav_event = nav_events[nav_keys[event.which]];

  var sibling;

  // One of the configured navigation events has occured.
  if (nav_event) {
    sibling = event.target.closest(".cell")[nav_event];
    if (sibling) {
      sibling.querySelector("button").focus();
    }
    // if

    event.preventDefault();
    event.stopPropagation();
  }
  // if


  // For activation input, trigger a click event. This is to allow activation
  // via keyboard without side-effects like scrolling the document.

  else if (
    [
      this.key_values.Spacebar,
      this.key_values.Enter,
    ].indexOf(event.which) >= 0
  ) {

    event.preventDefault();
    event.stopPropagation();
    event.target.click();
  }
  // else if
};
// input

module.exports = keyboardNav;
