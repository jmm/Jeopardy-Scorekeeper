import _ from 'underscore';
import View from "app/view/view";
import Dialog from "app/view/dialog/dialog";

var $ = View.$();
var Super_Klass = Dialog;

export default Super_Klass.extend({
  tagName: "div",
  className: "dialog",
  id: "dialog-daily-double",
  template_id: "dialog/daily-double",
  rendered: false,

  events () {
    return _.extend(_(Super_Klass.prototype).result('events'), {
      "click button.cancel": 'cancel_daily_double',
      "click button.skip": 'skip_daily_double',
      "click button.right": 'process_daily_double',
      "click button.wrong": 'process_daily_double',
      "submit #wager-form": function ( event ) { event.preventDefault(); },
      "change .data-field.wager-custom input[name='custom_wager']":
        "change_custom_wager_text",

      "focus .data-field.wager-custom input[name='custom_wager']":
        "focus_custom_wager_text",

      "click .data-field.wager-custom input[type='radio']":
        "select_custom_wager_text",

      "click .data-field input[name='wager'][type='radio']": "highlight_radio",
      "focus .data-field input[name='wager'][type='radio']": "highlight_radio",
      "blur .data-field input[name='wager'][type='radio']": "highlight_radio",
    });
  },
  // events

  /**
   * Handle 'change' events on the custom wager text input.
   *
   * @param obj event
   */
  change_custom_wager_text (event) {
    // Populate the custom wager radio input with the custom value entered.
    this.options.$els.custom_wager.radio.val(
      this.options.$els.custom_wager.text.val()
    );
  },
  // change_custom_wager_text

  select_custom_wager_text () {
    setTimeout(() => {
      this.options.$els.custom_wager.text.select();
    }, this.options.select_delay);
  },
  // select_custom_wager_text

  /**
   * Handle 'focus' events on the custom wager text input.
   *
   * @param obj event
   */
  focus_custom_wager_text (event) {
    // The custom wager radio is not already selected. Select it.
    if (! this.options.$els.custom_wager.radio[0].checked) {
      this.options.$els.custom_wager.radio.click();
    }
    // if

    // The custom wager radio is already selected. Select the contents of the
    // text input.
    else {
      this.select_custom_wager_text();
    }
    // else
  },
  // focus_custom_wager_text

  /**
   * Highlight the selected / focused wager type.
   *
   * @param obj event
   */
  highlight_radio (event) {
    // Various events and jQuery pseudo-events to handle.
    var props = {
      click: {class: 'selected', toggle: true},
      focus: {class: 'focused', toggle: true},
      focusin: {class: 'focused', toggle: true},
      focusout: {class: 'focused', toggle: false},
      blur: {class: 'focused', toggle: false},
    }[event.type];

    // Get the container of the current input.
    var data_field = $(event.target).closest(".data-field");
    data_field.toggleClass(props.class, props.toggle);

    if (event.type === 'click') {
      // Remove focus styling for the selected item. Remove selected styling
      // for siblings.
      data_field.toggleClass('focused', ! props.toggle);

      data_field.siblings(".data-field").toggleClass(
        props.class, ! props.toggle
      );
    }
    // if
  },
  // highlight_radio

  handle_kbd_nav (event) {
    var $target = $(event.target);

    if (
      $target.is("input[type='number']") &&
      event.which == this.key_values.Enter
    ) {
      // DEBUG jQuery.focus() prevents change event from firing in 1.4.4.
      // See http://bugs.jquery.com/ticket/7891
      $target.closest(".data-field").find("input[type='radio']")[0].focus();
    }
    // if

    else {
      return Super_Klass.prototype.handle_kbd_nav.apply(this, arguments);
    }
    // else
  },
  // handle_kbd_nav

  /**
   * Get the new active element as a result of keyboard navigation.
   *
   * @param obj cfg Keyboard navigation event properties.
   * @return void|obj Void or a DOM element.
   */
  handle_kbd_nav_get_new_el (cfg) {
    var new_active_element;

    // The event target is a member of a form (the wager form).
    if (cfg.target[0].form) {
      // If there's a prev|next (depending on nav_event.dir) data field sibling,
      // make it the new active element.
      new_active_element = cfg.target.closest(".data-field-wager")
        [cfg.nav_event.dir + "All"](".data-field-wager:visible")
        .eq(0).find("input[name='wager']");

      // The previous step did not locate a sibling in the wager form.
      if (
        ! new_active_element.length &&
        cfg.nav_event.dir == 'next'
      ) {
        // Make the first button the new active element.
        new_active_element = cfg.current_dialog.find("button:first");
      }
      // if
    }
    // if

    // The event target is not a member of the wager form -- it's a button.
    else if (
      // User is attempting to navigate northwest and the event target is the
      // first button.
      (
        (
          cfg.nav_key == 'Up' ||
          (cfg.nav_key == 'Tab' && cfg.event.shiftKey)

        ) &&

        cfg.current_dialog.find("button").index(cfg.event.target) === 0
      )

      ||

      // The dialog has the focus
      cfg.event.target === this.el
    ) {
      // Make the last data field in the wager form the new active element.
      new_active_element = cfg.current_dialog.find(
        "input[name='wager']:last:visible"
      );
    }
    // else if

    return new_active_element;
  },
  // handle_kbd_nav_get_new_el

  /**
   * Process player response.
   * @param obj event
   */
  process_daily_double (event) {
    event.preventDefault();

    this.model.clue.resolve_response({
      player: this.model.players.get(this.model.get('current_player')),
      correct: $(event.target).closest("button").hasClass('right'),
      wager: Number(this.$el.find("#wager-form input[name='wager']:checked").val()),
      deduct_incorrect: this.model.get('deduct_incorrect'),
    });
  },
  // process_daily_double

  /**
   * Close (discontinue play).
   * @param obj event
   */
  close_daily_double () {
    this.set_model(null);
    this.close({cache: true});
  },
  // close_daily_double

  /**
   * Skip the daily double, decrementing the count and leaving score alone.
   * @param obj event
   */
  skip_daily_double (event) {
    event.preventDefault();
    this.model.clue.finish();
  },
  // skip_daily_double

  /**
   * Back out of the daily double without affecting count or score.
   * @param obj event
   */
  cancel_daily_double (event) {
    event.preventDefault();
    this.model.clue.set('daily_double', false);
    if (! this.model.get('promoted')) this.model.clue.cancel();
    else this.close_daily_double();
  },
  // cancel_daily_double

  /**
   * Finish, remove from play.
   */
  finish_daily_double () {
    this.model.clue.finish();
  },
  // finish_daily_double

  set_default_focus () {
    this.$(".data-field-wager.selected input[name='wager']").focus();
  },
  // set_default_focus

  render () {
    var data = {
      wagers: {
        minimum: this.model.get('min_daily_double_wager'),
        natural: this.model.clue.get('value'),
        maximum: this.model.get('max_clue_value'),
        true_daily_double: this.model.players.get(
          this.model.get('current_player')
        ).get('score'),
      }
      // wagers
    };

    // Can't have a true daily double that's < the minimum wager. And the
    // "maximum" wager is irrelevant if it's less than the true daily double.
    [
      ['true_daily_double', 'minimum'],
      ['maximum', 'true_daily_double'],
    ].forEach(function (props) {
      data.wagers[props[0]] > data.wagers[props[1]] ||
        (data.wagers[props[0]] = false);
    });

    // View hasn't been rendered before.
    if (! this.rendered) {
      var view;
      var output = $(this.render_template(this.template_id, data));
      this.$el.html(output.html());

      /* Store custom wager input refs. */
      var custom_wager = {};
      custom_wager.text = this.$el.find(
        ".data-field.wager-custom input[name='custom_wager']"
      );

      custom_wager.radio = this.$el.find(
        ".data-field.wager-custom input[type='radio']"
      );

      this.options.$els = {custom_wager: custom_wager};
    }
    // if

    return this;
  },
  // render

  /**
   * Change model.
   * This allows the view to be cached and mostly reused without re-rendering.
   */
  set_model (model) {
    if (this.model) this.stopListening(this.model.clue);
    if (model) this.listenTo(model.clue, 'close', this.close_daily_double);
    this.model = model;
  },
  // initialize
});
