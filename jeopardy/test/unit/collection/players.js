var
  assert = require("assert"),
  Players = require('jeopardy/lib/collection/players').default,
  context;

describe("Collection : Players", function () {
  beforeEach(function () {
    context = {
      collection: new Players([
        {name: "Zero"},
        {name: "One", has_control: true},
        {name: "Two"},
      ]),
    };

    context.initial = context.collection.at(1);
    context.next = context.collection.at(-1);
  });
  // beforeEach

  it("change of control works correctly", function () {
    assert(context.collection.current() === context.initial);
    assert(context.initial.get('has_control'));

    context.collection.set_current(context.next);
    assert(! context.initial.get('has_control'));
    assert(context.collection.current() === context.next);
    assert(context.next.get('has_control'));

    context.initial.set_has_control(true);
    assert(! context.next.get('has_control'));
    assert(context.collection.current() === context.initial);
    assert(context.initial.get('has_control'));
  });
  // it

  it("added player with control becomes current", function () {
    assert(context.collection.current() === context.initial);
    assert(context.initial.get('has_control'));

    var new_player = context.collection.push({
      has_control: true,
    });

    assert(! context.initial.get('has_control'));
    assert(context.collection.current() === new_player);
    assert(new_player.get('has_control'));
  });
  // it

  it("next works with single player that's not current", function () {
    context.collection = new Players([context.collection.at(0)]);
    assert(context.collection.next() === context.collection.at(0));
  });
  // it
});
// describe
