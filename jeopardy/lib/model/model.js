import Backbone from 'backbone';
import is_bb_obj from 'jeopardy/lib/util/is-bb-obj';
var Super_Klass = Backbone.Model;
var Klass = Super_Klass.extend({
  /**
   * Process special data passed in as attributes.
   * Some data passed in as attributes need to be promoted and removed from attrs.
   * For example, nested models or collections, and properties used as
   * configuration to initialize the model.
   *
   * @param array|null keys Array of attribute keys to process.
   * @param object|undefined vals Hash of values to use for attrs.
   */
  process_pseudo_attrs (keys, vals) {
    keys = keys || Object.keys(this.pseudo_attrs);
    vals = vals || this.attributes;
    keys.forEach(attr => {
      var val = vals[attr];
      if (this.has(attr)) {
        this.unset(attr, {silent: true});
      }

      if (val !== undefined) {
        var handler = this.pseudo_attrs[attr];
        this[attr] =
          handler === true ?
          val :
          this.pseudo_attrs[attr].call(this, val);
      }
    });
  },
  // process_pseudo_attrs

  /**
   * Instantiates Backbone Model or Collection objects as necessary.
   * A pseudo attribute may either be a Model or Collection or need to be made
   * into one.
   *
   * @param object|array|null First arg to the ctor.
   * @param function klass Ctor.
   * @return object data if it was already an instance, or the new instance.
   */
  pseudo_attr_make (data, klass) {
    var val = data;
    if (! is_bb_obj(val)) {
      val = new klass(val);
    }

    return val;
  },
  // pseudo_attr_make

  /**
   * Partial apply pseudo_attr_make, fixing klass.
   * @param function klass A ctor.
   * @return function Partialed pseudo_attr_make.
   */
  pseudo_attr_maker (klass) {
    return (data) =>
      this.pseudo_attr_make(data, klass);
  },
  // pseudo_attr_maker
});

export default Klass;
