var
  assert = require("assert"),
  is_bb_obj = require('jeopardy/lib/util/is-bb-obj').default,
  Backbone = require('backbone'),
  Model = require('jeopardy/lib/model/model').default,
  Collection = require('jeopardy/lib/collection/collection').default,
  context;

describe("Util : is-bb-obj", function () {
  beforeEach(function () {
  });
  // beforeEach

  it("correctly identifies Backbone instances", function () {
    assert(is_bb_obj(new Backbone.Model));
    assert(is_bb_obj(new Backbone.Collection));
    assert(is_bb_obj(new Collection));
    assert(is_bb_obj(new Model));
    assert(! is_bb_obj({a: "A"}));
    assert(! is_bb_obj({listenTo: "A"}));
    assert(! is_bb_obj("A"));
    assert(! is_bb_obj(1));
  });
  // it
});
// describe
