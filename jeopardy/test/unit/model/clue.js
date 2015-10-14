var
  assert = require("assert"),
  base_class = require("jeopardy/lib/util/base-class"),
  Clue = require('jeopardy/lib/model/clue').default,
  context;

describe("Model : Clue", function () {
  beforeEach(function () {
    context = {
      model: new Clue,
    };
  });
  // beforeEach

  it("has correct default attributes", function () {
    [
      ['daily_double', false],
      ['enabled', true],
    ].forEach(function (attr) {
      assert(context.model.get(attr[0]) === attr[1]);
    });
  });
  // it

  it("finishes correctly", function () {
    base_class.init();
    context.model.open();
    context.model.finish();
    assert(context.model.get('enabled') === false);
  });
  // it

  it("skips correctly", function () {
    context.model.open();
    context.model.finish();
    assert(context.model.get('enabled') === false);
  });
  // it
});
// describe
