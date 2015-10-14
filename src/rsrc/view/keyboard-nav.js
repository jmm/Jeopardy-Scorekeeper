/* Mixin module to provide keyboard navigation functionality. */
var Keyboard_Nav = {};

Keyboard_Nav.key_values = {
  Up: 38,
  Down: 40,
  Left: 37,
  Right: 39,
  Tab: 9,
  Spacebar: 32,
  Enter: 13,
};

/// object Map of key value codes to names.
Keyboard_Nav.nav_keys = {};

// Map certain data from key_values into nav_keys.
(function (module, nav_keys) {
  var i, nav_key;
  for (i = 0; i < nav_keys.length ; ++i) {
    nav_key = nav_keys[i];
    module.nav_keys[module.key_values[nav_key]] = nav_key;
  }
  // for

  return;
})(Keyboard_Nav, ['Up', 'Down', 'Left', 'Right', 'Tab']);

/**
 * Handle keyboard navigation input.
 *
 * @param obj event
 * @return bool Return true if the input has been sufficiently handled, false if
 *   the caller may wish to further handle it.
 */
Keyboard_Nav.handle_kbd_nav_keypress = function (event) {
  if (event.type == 'keypress') {
    if (
      [
        this.key_values.Up,
        this.key_values.Down,
        this.key_values.Spacebar,
        this.key_values.Enter,
      ].indexOf(event.keyCode) !== -1

      ||

      (
        event.keyCode == this.key_values.Tab &&

        (
          // For some unknown reason Opera fires keypress at document after
          // dialog_keyboard_nav focuses a wager radio in response to Tab-ing.
          event.target == document ||

          (
            event.target.tagName &&
            event.target.tagName.toLowerCase() == 'button'
          )
        )
      )
    ) {
      event.preventDefault();
    }
    // if

    event.stopPropagation();

    return true;
  }
  // if

  return false;
};
// handle_kbd_nav_keypress

export default Keyboard_Nav;
