

/*

Copyright © 2010-2012 Jesse McCarthy <http://jessemccarthy.net/>

This file is part of the Jeopardy Scorekeeper software.  "JEOPARDY!"
is a trademark of Jeopardy Productions, Inc.  This software is not
endorsed by, sponsored by, or affiliated with Jeopardy Productions,
Inc.

This software may be used under the MIT (aka X11) license or
Simplified BSD (aka FreeBSD) license.  See LICENSE.

*/


/**
 * Player constructor.
 *
 * @param object player Initial player data.
 *
 * @return void
 */

Jeopardy.Player = function ( player ) {

  this.id = player.id;

  this.name = player.name;

  this.set_score( player.score );


  return;

}
// Jeopardy.Player


/// number ID, unique within the game.
Jeopardy.Player.prototype.id;

/// string Name.
Jeopardy.Player.prototype.name;

/// number Score.
Jeopardy.Player.prototype.score = 0;

/// boolean Has control of the board.
Jeopardy.Player.prototype.has_control = false;


/**
 * Sanitize a score value. E.g. to remove formatting added for the UI
 * or entered by the user.
 *
 * @param mixed score May be undefined, number, string, etc.
 *
 * @return number Sanitized score.
 */

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


/**
 * Set player's score.
 *
 * @param mixed score Maybe undefined, number, string, etc.
 *
 * @param boolean append Append score rather than overwrite.
 *
 * @return void
 */

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


/**
 * Update player's score.
 *
 * @param mixed score May be undefined, number, string, etc.
 *
 * @return number New score.
 */

Jeopardy.Player.prototype.update_score = function ( score ) {

  this.set_score( score, true );


  return this.score;

};
// Player.update_score


/**
 * Get player's score.
 *
 * @return number Score.
 */

Jeopardy.Player.prototype.get_score = function () {

  return this.score;

};
// Player.get_score


/**
 * Grant or revoke the player's control of the board.
 *
 * @param boolean has_control Has control of the board.
 *
 * @return void
 */

Jeopardy.Player.prototype.set_has_control = function ( has_control ) {

  this.has_control = has_control;


  return;

};
// Player.set_has_control
