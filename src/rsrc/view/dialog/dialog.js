import View from 'app/view/view';
import Kbd_Nav from 'app/view/keyboard-nav';

var $ = View.$();
var Super_Klass = View;

/**
 * Generic dialog superclass.
 */

// Mix in keyboard navigation functionality.
Super_Klass = Super_Klass.extend(Kbd_Nav);

export default Super_Klass.extend({
  events () {
    return {
      "keydown": 'handle_kbd_nav',
      "keypress": 'handle_kbd_nav',
    };
  },
  // events

  /**
   * Open the dialog.
   */
  open () {
    this.$el.toggleClass('enabled', true);
    this.render();

    // Set tabindex to make the dialog focusable.
    this.$el.attr('tabindex', 1);

    this.set_default_focus();
  },
  // open

  /**
  * Set the initial focus (e.g. the dialog as a whole or a specific element).
  *
  * This focuses the dialog as a whole. Subclasses can override with their
  * own logic.
  */
  set_default_focus () {
    this.$el.focus();
  },
  // set_default_focus

  /**
   * Handle keyboard navigation input for buttons. There are some common
   *   semantics for all of the dialogs.
   *
   * @param obj cfg Navigation event properties.
   * @return void|obj New active DOM element.
   */

  handle_kbd_nav_button (cfg) {
    var new_active_element, siblings;
    siblings = cfg.target[cfg.nav_event.dir + "All" ]("button:visible");

    var targ_offset = cfg.target.offset();

    siblings.each(function (index, element) {
      var curr_offset = $(element).offset();

      if (
        // East / West navigation. All siblings are eligible to be navigatated
        // to.
        (
          $.inArray(cfg.nav_key, ['Left', 'Right', 'Tab']) != -1
        )

        ||

        // North / South navigation. Sibling must be higher / lower then the
        // event target, respecitvely, to be eligible to navigate to.
        (
          $.inArray(cfg.nav_key, ['Up', 'Down']) != -1 &&
          curr_offset.top != targ_offset.top &&
          curr_offset.left == targ_offset.left
        )
      ) {
        new_active_element = $(element);
        return false;
      }
      // if
    });

    // Previous logic did not select a new active element, and the current
    // dialog has a method to perform further searching.
    if (
      ! new_active_element &&
      this.handle_kbd_nav_get_new_el
    ) {
      new_active_element = this.handle_kbd_nav_get_new_el(cfg);
    }
    // if

    return new_active_element;

  },
  // handle_kbd_nav_button

  /**
   * Handle general keyboard navigation input.
   *
   * @param obj event
   */
  handle_kbd_nav (event) {
    if (this.handle_kbd_nav_keypress(event)) {
      return;
    }
    // if

    var current_dialog = this.$el;
    var $target = $(event.target);

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
      event: event,
      nav_key: nav_key,
      nav_event: nav_event,
      current_dialog: current_dialog,
      target: $target,
    };

    // One of the directional navigation events has occured.
    if (nav_event) {
      // The target is a button, so run the button navigation routine.
      if ($target.is("button")) {
        new_active_element = this.handle_kbd_nav_button(cfg);
      }

      // Previous processing did not select a new active element, and the
      // current dialog has a method to perform further searching.
      if (
        ! new_active_element &&
        this.handle_kbd_nav_get_new_el
      ) {
        new_active_element = this.handle_kbd_nav_get_new_el(
          cfg
        );
      }
      // if

      // Previous logic did not select a new active element and the event target
      // is not a button.
      if (! (new_active_element || $target.is("button"))) {
        // Default buttons to navigate to. This is mostly to process the initial
        // keyboard navigation after a dialog has been opened and the dialog has
        // the focus.
        var selectors = [
          "button.skip:visible",
          "button:visible",
        ];

        $.each(selectors, function (index, selector) {
          new_active_element = current_dialog.find(selector);
          if (new_active_element.length) {
            return false;
          }
          // if
        });
      }
      // if

      if (new_active_element && new_active_element.length) {
        // DEBUG jQuery.focus() prevents blur event from firing in 1.4.4.
        // See http://bugs.jquery.com/ticket/7891
        new_active_element[0].focus();
      }
      // if

      event.stopPropagation();
      event.preventDefault();
    }
    // if

    // An activation event has occured.
    else if ($.inArray(
      event.which,
      [this.key_values.Enter, this.key_values.Spacebar]

    ) != -1) {

      // Prevent default to prevent behavior like scrolling the viewport when
      // pressing Spacebar, and fire click to activate the target.
      event.stopPropagation();
      event.preventDefault();
      $target.click();

      if ($target.is("button")) {
        $target.blur();
      }
      // if
    }
    // else if
  },
  // handle_kbd_nav
});
