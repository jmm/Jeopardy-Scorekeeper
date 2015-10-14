var
  assert = require("assert"),
  Player = require('jeopardy/lib/model/player').default,
  context;

describe("Model : Player", function () {
  beforeEach(function () {
    context = {
      model: new Player,
    };
  });
  // beforeEach

  it("has correct initial score", function () {
    context.score = 0;
    assert(context.model.get('score') === context.score);
    context.score = 400;
    context.model = new Player({score: context.score});
    assert(context.model.get('score') === context.score);
  });
  // it

  it("sanitize_score() works correctly", function () {
    var score = 400;
    assert(context.model.sanitize_score(score) === score);
    assert(context.model.sanitize_score("$" + score) === score);
  });
  // it

  it("sets score correctly", function () {
    context.score = 400;
    context.model.set('score', context.score);
    assert(context.model.get('score') === context.score);
    context.model.set('score', context.score * 2);
    assert(context.model.get('score') === (context.score * 2));
  });
  // it

  it("set_score() sanitizes correctly", function () {
    context.score = 123.456;

    context.model.set_score(context.score);
    assert(context.model.get('score') === Math.round(context.score));

    context.model.set_score("$" + context.score);
    assert(context.model.get('score') === Math.round(context.score));
  });
  // it

  it("updates score correctly", function () {
    context.score = 400;
    context.model.set('score', context.score);
    context.model.update_score(context.score);
    assert(context.model.get('score') === (context.score * 2));
  });
  // it

  it("update_score sanitizes correctly", function () {
    context.score = 123.456;

    context.model.set_score(0);
    context.model.update_score(context.score);
    assert(context.model.get('score') === Math.round(context.score));

    context.model.set_score(0);
    context.model.update_score("$" + context.score);
    assert(context.model.get('score') === Math.round(context.score));
  });
  // it

  it("doesn't have control by default", function () {
    assert(context.model.get('has_control') === false);
  });
  // it
});
// describe
