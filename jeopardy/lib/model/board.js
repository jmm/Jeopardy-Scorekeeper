import _ from 'underscore';
import game_defaults from 'jeopardy/lib/model/game-default-attrs';
import Model from 'jeopardy/lib/model/model';
import Collection from 'jeopardy/lib/collection/collection';
import Categories from 'jeopardy/lib/collection/categories';
var Super_Klass = Model;

var Klass = Super_Klass.extend({
  defaults () {
    return {
      // Pseudo attrs
      categories: null,
    };
  },
  // defaults

  /**
   * Initialize.
   */
  initialize (attrs = {}) {
    this.process_pseudo_attrs();

    var
      increment = this.min_clue_value,
      // Number of categories to populate
      num_cats = this.num_categories,
      category,
      i;

    this.clue_counts = new Collection(null, {
      model: Model,
    });

    if (! this.categories.length) {
      for (i = 1; i <= num_cats; ++i) {
        // TODO undocumented. See:
        // https://github.com/jashkenas/backbone/issues/3496
        category = this.categories.push({
          index: i,
          increment: increment,
          num_clues: this.category_length,
        });
        category.clues.forEach(clue =>
          change_clue_count.call(this, category, clue)
        );
      }
    }

    this.listenTo(this.categories, 'change:clues', change_clue_count);

    this.get_max_clue_value = _.memoize(this.get_max_clue_value);

    // In case no Daily Doubles were pre-defined.
    get_count.call(this, 'daily_double');
  },
  // initialize

  parse (attrs, opts) {
    this.process_pseudo_attrs(null, attrs);

    return _.omit(attrs, Object.keys(this.pseudo_attrs));
  },
  // parse

  pseudo_attrs: {
    min_clue_value: true,
    num_categories: true,
    category_length: true,
    categories: Super_Klass.prototype.pseudo_attr_maker(Categories),
  },

  num_categories: game_defaults.num_categories,

  category_length: game_defaults.category_length,

  /**
   * Return current max clue value.
   * This is used for example to calculate the maximum Daily Double wager a player
   * with a relatively low score may make.
   */
  get_max_clue_value () {
    return this.categories.at(0).clues.at(-1).get('value');
  },
  // get_max_clue_value
});


/**
 * Handle events signaling change in number of clues.
 *
 * @param object category Category the clue belongs to.
 * @param object clue Clue model.
 */
function change_clue_count (category, clue) {
  var board = this;
  var count = {
    value: clue.get('value')
  };
  var changed_attrs = clue.changedAttributes() || {};
  var addends = {
    clue: 0,
    daily_double: 0,
  };

  // Clue was added.
  if (! Object.keys(changed_attrs).length) {
    if (clue.get('enabled')) {
      addends.clue = 1;
      if (clue.get('daily_double')) addends.daily_double = addends.clue;
    }
  }

  if (changed_attrs.enabled != null) {
    addends.clue = clue.get('enabled') ? 1 : -1;
    if (clue.get('daily_double')) addends.daily_double = addends.clue;
  }

  if (changed_attrs.daily_double != null) {
    addends.daily_double = clue.get('daily_double') ? 1 : -1;
  }

  update_count(clue.get('value'), addends.clue);
  update_count('daily_double', addends.daily_double);

  function update_count (value, addend) {
    count = get_count.call(board, value);
    count.set(
      'count',
      count.get('count') + addend
    );
  }
  // update_count

  this.trigger('change:categories:clues', this.clue_counts, category, clue);
}
// change_clue_count

/**
 * Get the count model for the specified value, vivifying if necessary.
 * @param int|string value
 */
function get_count (value) {
  var count = {value};

  return this.clue_counts.findWhere(count) ||
    this.clue_counts.push(_.extend(count, {count: 0}));
}
// get_count

export default Klass;
