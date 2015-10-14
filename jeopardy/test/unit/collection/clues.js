var
  assert = require("assert"),
  Clues = require('jeopardy/lib/collection/clues').default,
  context;

describe("Collection : Clues", function () {
  beforeEach(function () {
    context = {
      clues: [
        {value: 200},
        {value: 100},
        {value: 300},
      ],
    };
  });
  // beforeEach

  it("sorts clues correctly", function () {
    var clues = new Clues(context.clues);
    context.clues.map(function (clue) {
      return clue.value;
    }).sort(function (a, b) {
      var ret = 0;
      if (a < b) ret = -1;
      if (a > b) ret = 1;
      return ret;
    }).forEach(function (val, i) {
      assert(clues.at(i).get('value') === val);
    });
  });
  // it
});
// describe
