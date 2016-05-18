/*
Wrapper component that implements keyboard navigation logic.
*/

"use strict";

// Defer setting `$|qs` until componentDidMount so that `document` isn't
// accessed until its known to be available.
var $;
// = document.querySelectorAll.bind(document);
var assign = require("object-assign");
var qs;
// = document.querySelector.bind(document);
var React = require("react");

var Keyboard_Nav = Object.create(null);

Keyboard_Nav.key_values = {
  Up: 38,
  Down: 40,
  Left: 37,
  Right: 39,
  Tab: 9,
  Spacebar: 32,
  Enter: 13,
};

/** object Map of key value codes to names. */
Keyboard_Nav.nav_keys = {};

// Map certain data from key_values into nav_keys.
(function (obj, nav_keys) {
  nav_keys.forEach(key => {
    obj.nav_keys[obj.key_values[key]] = key;
  });
})(Keyboard_Nav, ['Up', 'Down', 'Left', 'Right', 'Tab']);

/**
 * Determine if input is a logical button.
 * Element may be <button>, <a>, etc.
 *
 * @param object el DOM element.
 *
 * @return bool
 */
function isButton (el) {
  return el.classList.contains("button");
}

Keyboard_Nav.handlers = {
  /**
   * Handle keyboard navigation input for buttons. There are some common
   *   semantics for all of the dialogs.
   *
   * @param obj cfg Navigation event properties.
   * @return void|obj New active DOM element.
   */
  button (cfg) {
    var new_active_element, siblings;

    siblings = function (el) {
      var acc = [];
      var meth = (
        cfg.nav_event.dir === "prev" ? "previous" : "next"
      ) + "ElementSibling";
      while ((el = el[meth]) && isButton(el)) acc.push(el);
      return acc;
    }(cfg.target);

    var targ_offset = {
      top: cfg.target.offsetTop,
      left: cfg.target.offsetLeft,
    };

    siblings.some(function (element) {
      var curr_offset = {
        top: element.offsetTop,
        left: element.offsetLeft,
      };

      if (
        // East / West navigation. All siblings are eligible to be navigatated
        // to.
        ["Left", "Right", "Tab"].indexOf(cfg.nav_key) >= 0

        ||

        // North / South navigation. Sibling must be higher / lower then the
        // event target, respectively, to be eligible to navigate to.
        (
          ["Up", "Down"].indexOf(cfg.nav_key) >= 0 &&
          curr_offset.top !== targ_offset.top &&
          curr_offset.left === targ_offset.left
        )
      ) {
        new_active_element = element;
        return true;
      }
      // if
    });

    // Previous logic did not select a new active element, and the current
    // dialog has a method to perform further searching.
    if (
      ! new_active_element &&
      this.handlers.get_new_el
    ) {
      new_active_element = this.handlers.get_new_el(cfg);
    }
    // if

    return new_active_element;

  },
  // button

  /**
   * Handle general keyboard navigation input.
   *
   * @param obj event
   */
  input (event) {
    if (this.handlers.keypress(event)) {
      return;
    }
    // if

    var target = event.target;

    var nav_key, nav_keys = this.nav_keys;
    nav_key = nav_keys[event.which];

    var nav_event = {
      Up: {
        key: 'Up',
        dir: 'prev',
        sibling_offset: 1,
      },
      Left: {
        key: 'Left',
        dir: 'prev',
        sibling_offset: 0,
      },
      Down: {
        key: 'Down',
        dir: 'next',
        sibling_offset: 1,
      },
      Right: {
        key: 'Right',
        dir: 'next',
        sibling_offset: 0,
      },
      Tab: {
        key: 'Tab',
        dir: (event.shiftKey ? 'prev' : 'next'),
        sibling_offset: 0,
      }
    }[nav_key];

    var new_active_element;

    // Navigation event properties.
    var cfg = {
      event,
      nav_key,
      nav_event,
      target,
      current_dialog: target.closest(".dialog"),
    };

    // One of the directional navigation events has occured.
    if (nav_event) {
      // The target is a button, so run the button navigation routine.
      if (isButton(target)) {
        new_active_element = this.handlers.button(cfg);
      }

      // Previous processing did not select a new active element, and the
      // current dialog has a method to perform further searching.
      if (
        ! new_active_element &&
        this.handlers.get_new_el
      ) {
        new_active_element = this.handlers.get_new_el(cfg);
        if (new_active_element === false) return;
      }
      // if

      // Previous logic did not select a new active element and the event target
      // is not a button.
      if (! (new_active_element || isButton(target))) {
        // Default buttons to navigate to. This is mostly to process the initial
        // keyboard navigation after a dialog has been opened and the dialog has
        // the focus.
        var selectors = [
          "button.skip",
          "button",
        ];

        selectors.some(function (selector) {
          new_active_element = qs(".dialog " + selector);
          return !!new_active_element;
        });
      }
      // if

      if (new_active_element) {
        new_active_element.focus();
      }
      // if

      event.stopPropagation();
      event.preventDefault();
    }
    // if

    // An activation event has occured.
    else if (["Enter", "Spacebar"].some(
      key => this.key_values[key] === event.which
    )) {
      // Prevent default to prevent behavior like scrolling the viewport when
      // pressing Spacebar, and fire click to activate the target.
      event.stopPropagation();
      event.preventDefault();

      target.click();

      if (isButton(target)) target.blur();
    }
    // else if
  },
  // input
};

/**
 * Handle keyboard navigation input.
 *
 * @param obj event
 * @return bool Return true if the input has been sufficiently handled, false if
 *   the caller may wish to further handle it.
 */
Keyboard_Nav.handlers.keypress = function (event) {
  if (event.type === 'keypress') {
    if (
      ["Up", "Down", "Spacebar", "Enter"].some(
        key => this.key_values[key] === event.keyCode
      ) || (
        event.keyCode === this.key_values.Tab && (
          // For some unknown reason Opera fires keypress at document after
          // dialog_keyboard_nav focuses a wager radio in response to Tab-ing.
          event.target === document || isButton(event.target)
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
// keypress

/**
 * Setup customized navigation handler.
 *
 * @param object navSpec Customizations.
 *   object navSpec.handlers Method overrides.
 *
 * @return object
 */
function setupNavHandler (navSpec) {
  navSpec = assign({}, navSpec);

  var keyboardNav = Object.create(Keyboard_Nav);

  keyboardNav.handlers = Object.create(Keyboard_Nav.handlers);

  if (navSpec.handlers) {
    assign(keyboardNav.handlers, navSpec.handlers);
    delete navSpec.handlers;
  }

  for (var prop in keyboardNav.handlers) {
    keyboardNav.handlers[prop] = keyboardNav.handlers[prop].bind(keyboardNav);
  }

  return keyboardNav;
}

/**
 * Wrap a component with keyboard navigation logic.
 * @param ReactClass Klass Wrapped component.
 * @param object navSpec Custom navigation logic.
 *
 * @return ReactClass
 */

function wrapperFactory (navSpec) {
  if (!(
    typeof window !== "undefined" && window && window.window === window
  )) return;

  var handler = setupNavHandler(navSpec).handlers.input;

  var Wrapper = React.createClass({
    render () {
      var props = this.props;
      return (
        <div onKeyDown={handler} onKeyPress={handler}>
          {props.children}
        </div>
      );
    },

    componentDidMount () {
      // These assignments were deferred to here to ensure availability of
      // `document`.
      $ = document.querySelectorAll.bind(document);
      qs = document.querySelector.bind(document);
    },
  });

  Wrapper.displayName = "KeyboardNavContainer"

  return Wrapper;
}

module.exports = wrapperFactory;
