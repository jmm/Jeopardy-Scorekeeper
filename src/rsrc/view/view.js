import _ from 'underscore';
import Backbone from 'backbone';
import templates from 'app/templates';

var $ = Backbone.$;

var Super_Klass = Backbone.View;

var Klass = Super_Klass.extend({
  rendered: false,

  constructor (options) {
    // Restore pre-Backbone 1.1.0 behavior of attaching `options` as
    // this.options. Merge with existing this.options.
    this.options = _(options || {}).defaults(
      this.options,
      {
        enabled: true,
        // Delay to apply (e.g. via setTimeout) to calling
        // HTMLInputElement.select (e.g. in a `focus` handler).
        // integer Milliseconds
        select_delay: 200,
      }
    );

    Super_Klass.apply(
      this, Array.prototype.slice.call(arguments, 0)
    );
  },
  // constructor

  /**
   * Toggle 'enabled' state.
   * @param bool status New state.
   */
  toggle (status) {
    this.options.enabled = status;
    this.$el.toggleClass('enabled', status);
  },
  // toggle

  /**
   * Clean up self.
   * @param object cfg Config params.
   */
  close (cfg) {
    cfg = cfg || {};

    // Remove el from DOM, but retain it.
    if (cfg.cache) {
      this.$el.detach();
    }
    // if

    // Destroy all data associated with self.
    else {
      this.remove();

      // Unbind events
      this.stopListening();
    }
    // else

    this.trigger('close', this);
  },
  // close

  /**
   * Retrieve a template.
   *
   * @param string template_id Template ID.
   * @return string
   */
  get_template (template_id) {
    var template = templates;
    template_id.split("/").forEach(segment => template = template[segment]);

    return template;
  },
  // get_template

  /**
   * Render template.
   *
   * @return string Rendered template.
   */
  render_template () {
    var args = {}, outer_arguments = arguments, template;

    ['tmpl', 'data', 'extra'].forEach(function (key, index) {
      args[key] = outer_arguments[index] || {};
    });

    args.data = args.data || {};

    var helpers = {};

    helpers.option = function () {
      return function (text, render) {
        var el = $(text);

        var val_map = [
          [true, "1"],
          [false, "0"],
          [undefined, ""],
          [null, ""],
        ];

        var param = el.data('param').split(".");

        var param_val = this;

        _(param).each(function (prop) {
          if (prop in param_val) {
            param_val = param_val[prop];
          }

          else {
            return false;
          }
        });
        // each

        _(val_map).each(function (mapping) {
          if (mapping[0] === param_val) {
            param_val = mapping[1];
            return false;
          }
        });
        // each

        el.attr('selected', param_val === el.val());

        return el.wrap( "<div>" ).parent().html();
      };

    };
    // option

    _.defaults(args.data, helpers);

    template = this.get_template(args.tmpl);

    return template.render(
      args.data,
      _({}).extend(templates, args.extra.partials)
    );
  },
  // render_template
}, {
  $: function () {
    return Backbone.$;
  },
});

export default Klass;
