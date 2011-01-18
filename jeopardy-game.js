
/*

Copyright © 2010-2011 Jesse McCarthy <http://jessemccarthy.net/>

This file is part of the Jeopardy Scorekeeper software.  "JEOPARDY!" is a trademark of Jeopardy Productions, Inc.  This software is not endorsed by, sponsored by, or affiliated with Jeopardy Productions, Inc.

This software may be used under the MIT (aka X11) license or Simplified BSD
(aka FreeBSD) license.  See LICENSE.

*/


/**
 * Abstractly maintain the state of a Jeopardy game.
 *
 * Maintain the state of a Jeopardy game -- players, scores, clue counts, current player, etc. -- with no concept of a UI, except for the native Jeopardy UI (e.g. a board with columns of clue cells).
 */

Jeopardy.Game = function ( players, config ) {

  if ( players ) {

    this.set_players( players );

  }
  // if

  this.config = config;


  return;

};
// Jeopardy.Game


Jeopardy.Game.prototype.parent = Jeopardy.Game.prototype.constructor.prototype;

Jeopardy.Game.prototype.constructor = Jeopardy.Game;


Jeopardy.Game.prototype.player_class = Jeopardy.Player.constructor;


Jeopardy.Game.prototype.players = {};

Jeopardy.Game.prototype.player_order = [];

Jeopardy.Game.prototype.current_player;

Jeopardy.Game.prototype.num_tv_players = 3;


/*

config elements:

double_jeopardy_change_player_method = ( '' | 'min' | 'max' )

*/

Jeopardy.Game.prototype.config = {};

Jeopardy.Game.prototype.rounds = {

  '1' : "Single",

  '2' : "Double",

  '3' : "Final"

};


Jeopardy.Game.prototype.current_round = 0;

Jeopardy.Game.prototype.clue_counts = {};

Jeopardy.Game.prototype.current_cell;

Jeopardy.Game.prototype.categories = 6;

Jeopardy.Game.prototype.min_daily_double_wager = 5;

Jeopardy.Game.prototype.current_max_clue_value;


Jeopardy.Game.prototype.set_players = function ( players ) {

  this.players = {};

  var i;

  for ( i = 0 ; i < players.length ; ++i ) {

    players[ i ][ 'id' ] = i + 1;

    this.add_player( players[ i ] );

  }
  // for


  return;

};
// Game.set_players


Jeopardy.Game.prototype.add_player = function ( player ) {

  this.players[ player.id ] = this.create_player( player );

  this.player_order.push( player.id );


  return;

};
// Game.add_player


Jeopardy.Game.prototype.create_player = function ( player ) {

  return new this.player_class.constructor( player );

};
// Game.create_player


Jeopardy.Game.prototype.start_game = function () {

  var config = this.config;

  this.init_round( 1 );

  var current_player;


  if ( ! ( current_player = config[ 'current_player' ] ) ) {

    current_player = Math.floor( Math.random() * ( this.player_order.length ) ) + 1;

  }
  // if


  this.change_current_player( current_player );


  return;

};
// Game.start_game


Jeopardy.Game.prototype.change_current_player = function ( player_id ) {

  if ( this.current_player ) {

    this.current_player.set_has_control( false );

  }
  // if


  this.current_player = this.players[ player_id ];

  this.current_player.set_has_control( true );


  return;

};
// Game.change_current_player


Jeopardy.Game.prototype.double_jeopardy_change_player = function ( round ) {

  if (

    this.player_order.length > 1 &&

    this.config[ 'double_jeopardy_change_player_method' ]

  ) {

    var change_method = this.config[ 'double_jeopardy_change_player_method' ];

    var rev_player_order = this.player_order.slice( 0 );

    rev_player_order.reverse();

    var matching_player = this.players[ rev_player_order[0] ];

    var current_player;

    for ( i = 0 ; i < rev_player_order.length ; ++i ) {

      current_player = this.players[ rev_player_order[ i ] ];

      if (

        ( change_method == -1 && current_player.get_score() <= matching_player.get_score() ) ||

        ( change_method == 1 && current_player.get_score() >= matching_player.get_score() )

      ) {

        matching_player = current_player;

      }
      // if

    }
    // for


    if ( matching_player.id != this.current_player.id ) {

      this.change_current_player( matching_player.id );

    }
    // if

  }
  // if


  return;

};
// Game.double_jeopardy_change_player


Jeopardy.Game.prototype.init_round = function ( round ) {

  this.current_round = round;

  this.clue_counts[ round ] = {};

  var increment = 200 * round;

  var clue_count = this.categories;

  var clue_value;

  var i;


  if ( round <= 2 ) {

    if ( round == 2 ) {

      this.double_jeopardy_change_player();

    }
    // if


    for ( i = 1 ; i <= 5 ; ++i ) {

      clue_value = increment * i;

      this.clue_counts[ round ][ clue_value ] = clue_count;

    }
    // for


    this.current_max_clue_value = clue_value;

    this.clue_counts[ round ][ 'daily_double' ] = round;

  }
  // if


  return;

};
// Game.init_round


Jeopardy.Game.prototype.start_clue = function ( clue_value ) {

  this.current_clue = clue_value;


  return;

};
// Game.start_clue


Jeopardy.Game.prototype.finish_regular_clue = function ( correct ) {

  var clue_value = this.current_clue;

  if ( ! correct ) {

    clue_value = ( this.config[ 'deduct_incorrect_clue' ] ? - clue_value : 0 );

  }
  // if


  this.finish_clue( correct, clue_value );


  return;

};
// Game.finish_regular_clue


Jeopardy.Game.prototype.finish_clue = function ( correct, score_addend ) {

  this.current_player.update_score( score_addend );

  if ( ! correct ) {

    var current_player_index = this.player_order.indexOf( this.current_player.id ) + 1;

    if ( current_player_index >= this.player_order.length ) {

      current_player_index = 0;

    }
    // if


    this.change_current_player( this.player_order[ current_player_index ] );

  }
  // if


  this.clue_counts[ this.current_round ][ this.current_clue ] -= 1;

  this.current_clue = 0;


  return;

};
// Game.finish_clue


Jeopardy.Game.prototype.skip_clue = function () {

  this.finish_clue( true, 0 );


  return;

};
// Game.skip_clue


Jeopardy.Game.prototype.cancel_clue = function () {

  this.current_clue = 0;


  return;

};
// Game.cancel_clue


Jeopardy.Game.prototype.skip_daily_double = function () {

  this.clue_counts[ this.current_round ][ 'daily_double' ] -= 1;

  this.skip_clue();


  return;

};
// Game.skip_daily_double


Jeopardy.Game.prototype.start_daily_double = function () {

  return;

};
// Game.start_daily_double


Jeopardy.Game.prototype.finish_daily_double = function ( correct, wager ) {

  var max_wager = this.current_max_clue_value;

  if ( this.current_player.get_score() >= this.current_max_clue_value ) {

    max_wager = this.current_player.get_score();

  };


  wager = Math.max( Math.min( wager, max_wager ), this.min_daily_double_wager );


  if ( ! correct ) {

    wager = ( this.config[ 'deduct_incorrect_daily_double' ] ? - wager : 0 );

  }
  // if


  this.clue_counts[ this.current_round ][ 'daily_double' ] -= 1;

  this.finish_clue( correct, wager );


  return;

};
// Game.finish_daily_double


Jeopardy.Game.prototype.finish_final_jeopardy = function ( players ) {

  var i, player;

  for ( i = 0 ; i < players.length ; ++i ) {

    player = players[ i ];

    if ( player.score <= 0 ) {

      continue;

    }
    // if


    player[ 'wager' ] = Math.min( Math.max( 0, player[ 'wager' ] ), player[ 'score' ] ) * ( player[ 'correct' ] ? 1 : -1 );

    player[ 'score' ] += player[ 'wager' ];

  }
  // for


  return;

};
// Game.finish_final_jeopardy

