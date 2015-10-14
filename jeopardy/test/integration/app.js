var
  assert = require("assert"),
  event_publisher = require('jeopardy/lib/event-publisher'),
  Jeopardy = require('jeopardy').default

describe("Integration : App", function () {
  it("initializes event publisher", function () {
    var game = new Jeopardy;
    assert(game.event_publisher === event_publisher.default);
  });
  // it
});
// describe
