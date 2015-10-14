/*
This software is copyrighted. See LICENSE.
*/

import _ from 'underscore';
import View from 'app/view/view';
import Jeopardy from 'jeopardy';
import Game_View from 'app/view/game';

var cfg = {
  model: {players: [{}]},
  view: {display_clue_counts: true},
};

cfg.view.model = new Jeopardy(cfg.model);
View.prototype.event_publisher = cfg.view.model.event_publisher;

document.addEventListener('DOMContentLoaded', function () {
  cfg.view.el = View.$()("#game")[0];
  var game = (new Game_View(cfg.view)).render();

  game.model.players.views
    .get_view(game.model.players.at(0))
    .select_name();
});
