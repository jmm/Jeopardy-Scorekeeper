var
  assert = require("app/assert"),
  Model = require('jeopardy/lib/model/game').default,
  View = require('app/view/game').default,
  context;

describe("View : Game", function () {
  beforeEach(function () {
    context = {
      model: new Model,
    };

    context.view = new View({
      model: context.model,
    });
  });
  // beforeEach

  it("has properly init'd dialog stack", function () {
    assert(context.view.options.dialog_stack.length === 0);
  });
  // it
});
// describe
