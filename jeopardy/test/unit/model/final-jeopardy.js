var
  assert = require("assert"),
  Players = require('jeopardy/lib/collection/players').default,
  Final_Jeopardy = require('jeopardy/lib/model/final-jeopardy').default,
  context;

describe("Model : Final Jeopardy", function () {
  beforeEach(function () {
    context = {
      players: new Players([
        {
          score: 0,
        }
      ]),
    };
  });
  // beforeEach

  it("has correct number of players", function () {
    var num_tv_players = 3;
    context.model = new Final_Jeopardy({
      players: context.players,
      num_tv_players: 3,
    });

    assert(
      context.model.players.length ===
      (context.players.length + num_tv_players)
    );
  });
  // it

  it("assigns correct final scores", function () {
    var
      wager = 1000,
      players;

    players = new Players([
      {
        name: "Live1",
        score: 0,
        wager: wager,
        correct: true,
      },
      {
        name: "Live2",
        score: 2000,
        wager: wager,
        correct: false,
      },
      {
        name: "TV1",
        score: -100,
        wager: wager,
        correct: false,
      },
      {
        name: "TV2",
        score: 100,
        wager: wager,
        correct: true,
      },
      {
        name: "TV3",
        score: 1100,
        wager: wager,
        correct: true,
      },
    ]);

    context.model = new Final_Jeopardy({
      players: players,
    });

    context.model.process_responses();

    // Ineligible to wager because of score = 0.
    assert(players.findWhere({name: "Live1"}).get('score') === 0);
    assert(players.findWhere({name: "Live2"}).get('score') === 1000);
    // Wager limited by score.
    assert(players.findWhere({name: "TV1"}).get('score') === -100);
    // Wager limited by score.
    assert(players.findWhere({name: "TV2"}).get('score') === 200);
    assert(players.findWhere({name: "TV3"}).get('score') === 2100);
  });
  // it

  it("uses working score to calculate final score", function () {
    var
      player,
      attrs = {
        working_score: 100,
        wager: 1,
      };

    context.model = new Final_Jeopardy({
      players: context.players,
    });

    player = context.model.players.at(0);

    [true, false].forEach(function (correct) {
      attrs.correct = correct;
      player.set(attrs);
      context.model.process_responses();
      assert(
        player.get('score') ===
        attrs.working_score + (attrs.wager * (correct ? 1 : -1))
      );
    });
  });
  // it
});
// describe
