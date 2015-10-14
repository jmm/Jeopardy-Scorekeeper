import View from 'app/view/view';
import Kbd_Nav from 'app/view/keyboard-nav';

var $ = View.$();

var Super_Klass = View;

// Mix in keyboard navigation functionality.
var Klass = Super_Klass.extend(Kbd_Nav).extend({
  tagName: 'div',
  id: 'board',
  className: 'view',
  template_id: 'board',

  events: {
    "click .cell.enabled button": "open_clue",
    "keydown": "handle_keyboard_nav",
    "keypress": "handle_keyboard_nav",
  },
  // events

  initialize (options) {
    var self = this;

    this.listenTo(
      this.model,
      'change:categories:clues',
      this.render
    );

    // Cache some cell data during rounds.
    this.options.cells = [];
  },
  // initialize

  /**
   * Start playing a clue.
   * @param obj event
   */
  open_clue (event) {
    event.preventDefault();

    // Board is disabled.
    if (! this.options.enabled) {
      return;
    }
    // if

    var current_cell = $(event.target).closest(".cell");

    var clue;

    // Find the actual model to use. Due to the UI implemented here, this just
    // finds the first enabled clue of the selected value.
    // There's probably a more performant way to do this if it matters enough.
    this.model.categories.every((category) => {
      clue = category.clues.findWhere({
        value: current_cell.data('clueValue'),
        enabled: true,
      });

      return ! clue;
    });

    this.event_publisher.trigger('view:open-dialog-request', {
      type: clue.get('daily_double') ? 'daily_double' : 'clue',
      view: this,
      model: clue,
      cell: current_cell,
    });
  },
  // open_clue

  /**
   * Focus the default cell, e.g. when returning focus to the board from a
   * dialog.
   */
  focus_default_cell () {
    this.$el.find(".cell button").eq(this.default_focus_cell).focus();
  },

  /**
   * Handle keyboard input.
   * @param obj event
   */
  handle_keyboard_nav (event) {
    // Certain keyboard events don't need to be handled specifically for this
    // view.
    if (this.handle_kbd_nav_keypress(event)) {
      return;
    }
    // if

    /* Map various keys to corresponding navigation movements. */
    var nav_keys = {};

    nav_keys[this.key_values['Up']] = 'Up';
    nav_keys["z".charCodeAt(0)] = 'Up';
    nav_keys["Z".charCodeAt(0)] = 'Up';

    nav_keys[this.key_values['Down']] = 'Down';
    nav_keys["x".charCodeAt(0)] = 'Down';
    nav_keys["X".charCodeAt(0)] = 'Down';

    // Map some navigation movements to corresponding jQuery traversal methods.
    var nav_events = {Up: 'prev', Down: 'next'};

    var nav_event = nav_events[nav_keys[event.which]];

    var sibling;

    // One of the configured navigation events has occured.
    if (nav_event) {
      sibling = $(event.target).closest('.cell')[nav_event]();
      if (sibling.length) {
        sibling.find('button').focus();
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
      ].indexOf(event.which) !== -1
    ) {

      event.preventDefault();
      event.stopPropagation();
      $(event.target).click();
    }
    // else if
  },
  // handle_keyboard_nav

  /**
   * Render HTML string representing view.
   * @return string HTML representing view.
   */
  render_string () {
    var
      board = this,
      data = {};

    var
      cells = this.options.cells;

    this.model.clue_counts
      .chain()
      .filter((clue) => ! isNaN(clue.get('value')))
      .sortBy('value')
      .forEach((clue, i, clues) => {
        var cell;

        cell = this.options.cells[i];

        if (! cell) {
          cell = {
            clue_value: clue.get('value'),
            label: clue.get('value'),
          };
          cells.push(cell);
        }

        cell.clue_count = clue.get('count');
        cell.enabled = !! cell.clue_count;

        if (! board.options.display_clue_counts) {
          delete cell.clue_count;
        }

        // Make the middle cell the default focus target.
        if (
          ! board.default_focus_cell &&
          ((i + 1) / clues.length) >= 0.5
        ) {
          board.default_focus_cell = i;
        }
        // if
      });

    data.cells = cells;

    var extra = {
      partials: {
        cell: this.get_template('cell')
      },
    };

    return this.render_template(this.template_id, data, extra);
  },
  // render_string

  render () {
    var
      output = $(this.render_string());

    this.$el.toggleClass('enabled', true);
    this.$el.html(output.html());

    this.focus_default_cell();

    return this;
  },
  // render
});

export default Klass;
