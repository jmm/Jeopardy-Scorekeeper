var
  assert = require("assert"),
  Category = require('jeopardy/lib/model/category').default,
  context;

describe("Model : Category", function () {
  beforeEach(function () {
    context = {
      increment: 200,
    };
  });
  // beforeEach

  it("has clues", function () {
    context.model = new Category({
      increment: context.increment,
    }, {
      parse: true,
    });

    assert(context.model.clues.length === Category.prototype.num_clues);

    context.model.clues.forEach(function (clue, i) {
      assert(clue.get('value') === context.increment * (i + 1));
    });
  });
  // it
});
// describe
