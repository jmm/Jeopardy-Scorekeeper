var
  assert = require("assert"),
  Game = require('jeopardy/lib/model/game').default,
  Board = require('jeopardy/lib/model/board').default,
  context;

describe("Model : Board", function () {
  beforeEach(function () {
    var attrs = {
      min_clue_value: 200,
    };
    context = {
      attrs: attrs,
      model: new Board(attrs, {parse: true}),
      defaults: Game.prototype.defaults(),
    };
  });
  // beforeEach

  it("has default categories", function () {
    assert(
      context.model.categories.length ===
      context.defaults.num_categories
    );
  });
  // it

  it("has default clue counts", function () {
    assert(
      context.model.clue_counts.length ===
      context.defaults.category_length + ['daily_double'].length
    );
  });
  // it

  describe("decrements daily double count", function () {
    beforeEach(function () {
      context.clue_count = context.model.clue_counts.findWhere({
        value: 'daily_double',
      });
      context.daily_double_count = 0;
    });

    it("predefined daily double", function () {
      var clue = context.model.categories.at(0).clues.at(0);
      context.daily_double_count++;
      clue.set('daily_double', true);
      clue.open();

      assert(
        context.clue_count.get('count') ===
        context.daily_double_count
      );

      context.daily_double_count--;

      clue.finish();

      assert(
        context.clue_count.get('count') ===
        context.daily_double_count
      );
    });
    // it

    it("promoted daily double", function () {
      var clue = context.model.categories.at(0).clues.at(0);
      clue.open();
      context.daily_double_count++;
      clue.set('daily_double', true);

      assert(
        context.clue_count.get('count') === context.daily_double_count
      );

      context.daily_double_count--;

      clue.finish();

      assert(
        context.clue_count.get('count') === context.daily_double_count
      );
    });
    // it

    it("promoted, demoted daily double", function () {
      var clue = context.model.categories.at(0).clues.at(0);
      clue.open();

      context.daily_double_count++;
      clue.set('daily_double', true);
      assert(
        context.clue_count.get('count') === context.daily_double_count
      );

      context.daily_double_count--;
      clue.set('daily_double', false);
      assert(
        context.clue_count.get('count') === context.daily_double_count
      );

      clue.finish();
      assert(
        context.clue_count.get('count') === context.daily_double_count
      );
    });
    // it
  });
  // describe
});
// describe
