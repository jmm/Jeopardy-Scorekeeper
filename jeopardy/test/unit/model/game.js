var
  assert = require("assert"),
  Game = require('jeopardy/lib/model/game').default,
  i;

describe("Model : Game", function () {
  it("has correct initial number of players (default)", function () {
    assert(
      (new Game).players.length ===
      (Game.prototype.defaults().players || []).length
    );
  });
  // it

  it("has correct initial number of players (passed in)", function () {
    var
      players = [{}, {}],
      model = new Game({players: players});

    assert(model.players.length === players.length);
  });
  // it

  it("has correct initial player", function () {
    var
      players = [{name: "First"}, {name: "Second"}],
      model = new Game({players: players});

    model.start_game();
    assert(model.players.current().get('name') === "First");
  });
  // it

  it("cycles rounds correctly", function () {
    var game = new Game({players: [{}]});
    i = 0;

    game.start_game();

    while (i <= 3) {
      assert(game.rounds.current().get('number') === ++i);
      game.end_round();
    }
  });
  // it

  it("sets current player correctly", function () {
    var
      model = new Game({players: [{id: "1"}]}),
      player = new model.players.model({
        id: "2"
      });

    model.players.add(player);
    model.players.set_current(player);
    assert(model.players.current().id === player.id);
    assert(player.get('has_control') === true);
    assert(! model.players.at(0).get('has_control'));
  });
  // it

  it("advances current player after incorrect clue response", function () {
    var
      model = new Game({players: [
        {id: 1},
        {id: 2},
      ]});

    model.start_game();
    var clue = model.rounds.current().board.categories.at(0).clues.at(0);
    clue.open();
    clue.resolve_response({
      player: model.players.current(),
      wager: 0,
      correct: false,
    });

    assert(model.players.current().id === 2);
  });
  // it

  it("sets current player on round change", function () {
    var
      model = new Game({players: [
        {id: 1, score: 1},
        {id: 2, score: 2},
      ]});

    model.start_game();
    model.players.set_current(model.players.at(-1));
    model.rounds.current().end();

    assert(
      model.players.at(0) === model.players.current(),
      "Lowest scored player should have control of the board to start the round."
    );
  });
  // it
});
// describe
