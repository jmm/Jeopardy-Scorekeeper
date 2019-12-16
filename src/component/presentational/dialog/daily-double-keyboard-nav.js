/*
Keyboard navigation config for daily-double.
*/
"use strict";

var keyboardNav = {};

keyboardNav.handlers = {
  input (event) {
    var target = event.target;

    if (
      target.matches("input[type='number']") &&
      event.which === this.key_values.Enter
    ) {
      [].forEach.call(target.closest(".data-field").parentNode.children, el => {
        if (!el.matches(".data-field")) return;
        var focused = el === target;
        el.classList.toggle("focused", focused);
        if (focused) el.querySelector("input[type='radio']").focus();
      });
    }
    // if

    else {
      return Object.getPrototypeOf(this)
        .handlers.input.apply(this, arguments);
    }
    // else
  },
  // input

  /**
   * Get the new active element as a result of keyboard navigation.
   *
   * @param obj cfg Keyboard navigation event properties.
   * @return void|obj Void or a DOM element.
   */
  get_new_el (cfg) {
    var new_active_element;

    /**
     * Event target is a button in the first row?
     * @return bool
     */
    function isFirstRowButton () {
      var buttons = [].slice.call(
        cfg.current_dialog.querySelectorAll("button")
      );
      return buttons.some((el) => {
        return (
          el === cfg.event.target &&
          el.offsetTop === buttons[0].offsetTop
        );
      });
    }
    // isFirstRowButton

    /**
     * User is navigating northwest from first row button or dialog?
     * @return bool
     */
    function isButtonToWagers () {
      return (
        (
          cfg.nav_key === "Up" ||
          (cfg.nav_key === "Tab" && cfg.event.shiftKey)
        ) &&

        isFirstRowButton()
      );
    }
    // isButtonToWagers

    // The event target is a member of a form (the wager form).
    if (cfg.target.form) {
      // If there's a prev|next (depending on nav_event.dir) data field sibling,
      // make it the new active element.
      new_active_element =
        cfg.target.closest(".data-field-wager")[
          (cfg.nav_event.dir === "prev" ? "previous" : "next") +
          "ElementSibling"
        ];

      if (
        new_active_element &&
        new_active_element.matches(".data-field-wager")
      ) {
        new_active_element =
          new_active_element.querySelector("input[name='wager']");
      }
      else new_active_element = null;

      // The previous step did not locate a sibling in the wager form.
      if (! new_active_element) {
        if (cfg.nav_event.dir === "next") {
          // Make the first button the new active element.
          new_active_element = cfg.current_dialog.querySelector("button");
        }
        else {
          cfg.event.preventDefault();
          return false;
        }
      }
      // if
    }
    // if

    // The event target is not a member of the wager form -- it's a button or
    // the dialog.
    else {
      if (
        isButtonToWagers() ||

        // The dialog has the focus
        cfg.event.target === cfg.current_dialog
      ) {
        // Make the last data field in the wager form the new active element.
        new_active_element = [].slice.call(
          cfg.current_dialog.querySelectorAll("input[name='wager']"), -1
        )[0];
      }
      // if
    }
    // else

    return new_active_element;
  },
  // get_new_el
};

module.exports = keyboardNav;
