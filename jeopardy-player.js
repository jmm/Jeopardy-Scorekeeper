
/*

Copyright © 2010-2011 Jesse McCarthy <http://jessemccarthy.net/>

This file is part of the Jeopardy Scorekeeper software.  "JEOPARDY!" is a trademark of Jeopardy Productions, Inc.  This software is not endorsed by, sponsored by, or affiliated with Jeopardy Productions, Inc.

This software may be used under the MIT (aka X11) license or Simplified BSD
(aka FreeBSD) license.  See LICENSE.

*/


Jeopardy.Player = function ( player ) {

  this.id = player.id;

  this.name = player.name;

  this.set_score( player.score );


  return;

}
// Jeopardy.Player


Jeopardy.Player.prototype.id;

Jeopardy.Player.prototype.name;

Jeopardy.Player.prototype.score = 0;

Jeopardy.Player.prototype.has_control = false;



Jeopardy.Player.prototype.sanitize_score = function ( score ) {

  if ( score === undefined ) {

    score = 0;

  }
  // if

  score = Number( score.toString().replace( /[^0-9.-]/g, '' ) );

  if ( isNaN( score ) ) {

    score = 0;

  }
  // if


  return score;

};
// Player.sanitize_score


Jeopardy.Player.prototype.set_score = function ( score, append ) {

  score = this.sanitize_score( score );


  if ( append ) {

    score += this.score;

  }
  // if


  this.score = Number( score.toFixed( 0 ) );


  return;

};
// Player.set_score


Jeopardy.Player.prototype.update_score = function ( score ) {

  this.set_score( score, true );


  return this.score;

};
// Player.update_score


Jeopardy.Player.prototype.get_score = function () {

  return this.score;

};
// Player.get_score


Jeopardy.Player.prototype.set_has_control = function ( has_control ) {

  this.has_control = has_control;


  return;

};
// Player.set_has_control
