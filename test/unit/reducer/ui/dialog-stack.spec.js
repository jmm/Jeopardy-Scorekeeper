"use strict";

var reducer = require("app/reducer/ui/dialog-stack").reducer;
var test = require("tape");

/**
 * Assert fresh state that should exist after init or ADVANCE_ROUND.
 */
function assertFresh (t, state) {
  t.assert(Array.isArray(state), "State should be an array");
  t.equal(state.length, 0, "Length should be 0");
}

var suiteDesc = "reducer/dialog-stack : ";

test(suiteDesc + "Initializes correctly", function (t) {
  var state = reducer();
  assertFresh(t, state);

  t.end();
});

test(suiteDesc + "Responds to OPEN_DIALOG|CLOSE_DIALOG correctly", function (t) {
  var state = reducer();

  var payloads = [{}, {}];

  payloads.forEach((payload, i) => {
    state = reducer(state, {
      type: "OPEN_DIALOG",
      payload,
    });

    t.equal(
      state.length,
      i + 1,
      "Length should be correct after OPEN_DIALOG"
    );

    t.equal(
      state[state.length - 1],
      payload,
      "Element -1 should be correct after OPEN_DIALOG"
    );
  });

  var i = payloads.length;

  while (i--) {
    state = reducer(state, {
      type: "CLOSE_DIALOG",
    });

    t.equal(
      state.length,
      i,
      "Length should be correct after CLOSE_DIALOG"
    );

    if (state.length) {
      t.equal(
        state[state.length - 1],
        payloads[i - 1],
        "Element -1 should be correct after CLOSE_DIALOG"
      );
    }
  }

  t.end();
});

test(suiteDesc + "Responds to ADVANCE_ROUND correctly", function (t) {
  var state = reducer();

  state = reducer(state, {
    type: "ADVANCE_ROUND",
  });

  assertFresh(t, state);

  t.end();
});
