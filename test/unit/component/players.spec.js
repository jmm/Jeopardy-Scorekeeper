"use strict";

var Component = require("app/component/presentational/players");
var enzyme = require("enzyme");
var React = require("react");
var test = require("tape");

var suiteDesc = "component/players : ";
var desc;

desc = suiteDesc + "Shallow renders correctly";
test(desc, function (t) {
  var propSets = [
    {players: []},
    {
      players: [
        {score: 0},
        {score: 0},
        {score: 0},
      ],
      current_player: 1,
    }
  ];

  propSets.forEach(props => {
    var el = <Component {...props} />;

    var wrapper = enzyme.shallow(el);

    t.equal(
      wrapper.children().length,
      props.players.length,
      "Should have a child for each player (" + props.players.length + ")"
    );
  });

  t.end();
});
