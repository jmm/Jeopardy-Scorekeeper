var
  assert = require("app/assert"),
  Model = require('jeopardy/lib/model/player').default,
  View = require('app/view/player').default,
  context;

describe("View : Player", function () {
  beforeEach(function () {
    context = {
      model: new Model,
    };

    sinon.spy(View.prototype, 'process_update_request');

    context.view = new View({
      model: context.model
    });
  });
  // beforeEach

  afterEach(function () {
    View.prototype.process_update_request.restore();
  });
  // afterEach

  it("doesn't have control by default", function () {
    assert(context.view.$el.hasClass('has-control') === false);
  });
  // it

  it("gains control on demand", function () {
    context.view.set_has_control();
    assert(context.view.$el.hasClass('has-control') === true);
  });
  // it

  it("updates score correctly", function () {
    context.view.render();

    var
      callCount = 0,
      val = {number: 1},
      score;

    function get_score () {
      return context.view.$("input.score");
    }

    val.string = "$" + val.number;
    get_score().val(val.string).change();
    assert(
      context.view.process_update_request.callCount === ++callCount,
      "process_update_request() should've been called for each change of value."
    );
    assert(
      context.model.get('score') === context.model.sanitize_score("") &&
      get_score().val() === "",
      "Updated player score isn't correct: " + get_score().val()
    );

    val.string = String(val.number);
    get_score().val(val.string).change();
    assert(
      context.view.process_update_request.callCount === ++callCount,
      "process_update_request() should've been called for each change of value."
    );
    assert(
      context.model.get('score') === val.number &&
      get_score().val() === val.string,
      "Updated player score isn't correct: " + get_score().val()
    );
  });
  // it
});
// describe
