/*
Keyboard navigation config for final-jeopardy.
*/
"use strict";

var keyboardNav = {};

keyboardNav.handlers = {
  /**
   * Get the new active element as a result of keyboard navigation.
   *
   * @param obj cfg Keyboard navigation event properties.
   * @return void|obj Void or a DOM element.
   */
  get_new_el (cfg) {
    var new_active_element;

    // User is attempting to navigate northwest and the event target is the
    // first button
    if (
      (
        cfg.nav_key === 'Up' ||
        (cfg.nav_key === 'Tab' && cfg.event.shiftKey)
      ) &&

      cfg.event.target.matches("button") &&
      cfg.event.target.closest(".dialog-control")
    ) {
      new_active_element = cfg.current_dialog.querySelector("tr.player:last-child");

      // The user is navigating north -- select the score input.
      if (cfg.nav_key === 'Up') {
        new_active_element =
          new_active_element.querySelector(".score.before input");
      }

      // The user is navigating west -- select the 'correct' input.
      else {
        new_active_element =
          new_active_element.querySelector(".correct .right input");
      }
    }
    // if

    return new_active_element;
  },
  // get_new_el

  /**
   * Handle general keyboard navigation input.
   * @param obj event
   */
  input (event) {
    var
      // bool .select() the active element.
      select = false;

    // Run the parent class method when the target is a button.
    if (event.target.matches("button")) {
      Object.getPrototypeOf(this).handlers.input.apply(this, arguments);
      return;
    }
    // if

    if (this.handlers.keypress(event)) return;

    var new_active_element;
    var target = event.target;
    var nav_key, nav_keys = this.nav_keys;
    nav_key = nav_keys[event.which];

    var nav_event = {
      Up: {
        key: 'Up',
        dir: 'prev',
        sibling_offset: 1,
        is_arrow: true,
      },

      Down: {
        key: 'Down',
        dir: 'next',
        sibling_offset: 1,
        is_arrow: true,
      },

      Left: {
        key: 'Left',
        dir: 'prev',
        sibling_offset: 0,
        is_arrow: true,
      },

      Right: {
        key: 'Right',
        dir: 'next',
        sibling_offset: 0,
        is_arrow: true,
      },

      Tab: {
        key: 'Tab',
        dir: (event.shiftKey ? 'prev' : 'next'),
        sibling_offset: 0,
        is_arrow: false,
      }
      // Tab
    }[nav_key];

    var sibling, class_names;

    var cfg = {
      event: event,
      nav_key: nav_key,
      nav_event: nav_event,
      current_dialog: event.target.closest(".dialog"),
      target: event.target,
    };

    // One of the configured directional navigation events has occured.
    if (nav_event) {
      if (event.target === cfg.current_dialog) {
        new_active_element = cfg.current_dialog.querySelector(
          "tr.player.tv .score.before input"
        );
      }
      // if

      // North / South navigation within columns.
      if (
        target.tagName.toLowerCase() === "input" &&
        ['Up', 'Down'].indexOf(nav_key) >= 0
      ) {
        let cell = target.closest("td, th");
        class_names = cell.className.replace(/ /g, ".");

        // Navigate to the row for the closest sibling in the indicated
        // direction that isn't disabled.
        var siblingMethod =
          (nav_event.dir === "prev" ? "previous" : "next") +
          "ElementSibling";

        sibling = cell.closest("tr");

        while (sibling) {
          if (!sibling.matches(":not(.disabled)")) {
            sibling = sibling[siblingMethod]
            continue;
          }

          sibling = sibling.querySelector(
            `${
              cell.tagName.toLowerCase()
            }${
              class_names ? `.${class_names}` : ""
            } input`
          );
          break;
        }

        select = !!sibling

        if (select) {
          new_active_element = sibling;
        }

        // Navigate from the last player row to the first button.
        else if (nav_key === 'Down') {
          new_active_element = cfg.current_dialog.querySelector("button");
        }

        else {
          event.preventDefault();
        }
      }
      // if

      // When arrow key input is received and one of the text inputs isn't the
      // target, suppress native behavior like scrolling the viewport.
      else if (
        nav_event.is_arrow &&
        ["number", "text"].indexOf(target.type) < 0
      ) {
        event.preventDefault();
      }
      // else if

      // When the last element in a given direction within the dialog is
      // focused, prevent further attempts to navigate in that direction from
      // moving focus out of the dialog.
      else if (
        nav_key === 'Tab' &&
        (
          // Attempt to navigate to next from last button.
          (
            target.matches("button") &&
            ! target.nextElementSibling.matches("button")
          )

          ||

          // Attempt to navigate to previous from first player or first enabled
          // player.
          (
            nav_event.dir === 'prev' &&

            (
              cfg.current_dialog.querySelector("input") === target ||

              cfg.current_dialog
              .querySelector("input:not([tabindex='-1'])")
              ===
              target
            )
          )
        )
      ) {
        event.preventDefault();
      }
      // else if

      if (new_active_element) {
        event.preventDefault();

        new_active_element.focus();
        if (select) {
          new_active_element.select();
        }
      }
    }
    // if

    event.stopPropagation();
  },
  // input
};

module.exports = keyboardNav;
