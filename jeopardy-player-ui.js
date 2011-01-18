
/*

Copyright © 2010-2011 Jesse McCarthy <http://jessemccarthy.net/>

This file is part of the Jeopardy Scorekeeper software.  "JEOPARDY!" is a trademark of Jeopardy Productions, Inc.  This software is not endorsed by, sponsored by, or affiliated with Jeopardy Productions, Inc.

This software may be used under the MIT (aka X11) license or Simplified BSD
(aka FreeBSD) license.  See LICENSE.

*/


Jeopardy.Player_UI = function ( player ) {

  this.parent.call( this, player );


  return;

};
// Jeopardy.Player_UI


Jeopardy.Player_UI.prototype = new Jeopardy.Player( {} );

Jeopardy.Player_UI.prototype.parent = Jeopardy.Player;

Jeopardy.Player_UI.prototype.constructor = Jeopardy.Player_UI;


Jeopardy.Player_UI.prototype.set_has_control = function ( has_control ) {

  this.parent.prototype.set_has_control.call( this, has_control );

  this.update_ui();


  return;

};
// Player_UI.set_has_control


Jeopardy.Player_UI.prototype.update_info = function ( ui ) {

  ui = $( ui );

  var property = ui[0].name.match( /\[([^\]]+)\]$/ )[1];

  var value = ui.val();

  if ( property == 'score' ) {

    this.set_score( value );

  }
  // if

  else {

    this[ property ] = value;

  }
  // else


  this.update_ui();


  return;

};
// Player_UI.update_info


Jeopardy.Player_UI.prototype.get_ui_score = function () {

  var score = this.get_score().toString().replace( /^(-?)/, "$1$$" );


  return score;

};
// get_ui_score


Jeopardy.Player_UI.prototype.get_ui = function () {

  if ( this instanceof Jeopardy.Player_UI ) {

    var data = { 'id' : this.id, 'name' : this.name, 'score' : this.get_ui_score() };

  }
  // if


  var output = $( "#fragments > .player" ).clone();

  output.attr( 'id', ( output.attr( 'id' ) + data[ 'id' ] ) );

  output.data( 'id', data[ 'id' ] );

  output.find( ".name input" ).val( data[ 'name' ] );

  output.find( ".score input" ).val( data[ 'score' ] );


  return output;

};
// Player_UI.get_ui


Jeopardy.Player_UI.prototype.update_ui = function () {

  var document_id = "#player-" + this.id;

  $( document_id + " .name input" ).val( this.name );

  $( document_id + " .score input" ).val( this.get_ui_score() );

  $( document_id ).toggleClass( 'has_control', this.has_control );


  $( "#current_player_control option[value='" + this.id + "']" ).text( this.name );


  return;

};
// Player_UI.update_ui


Jeopardy.Player_UI.prototype.get_final_jeopardy_ui = function ( tv_player_number ) {

  var data = {};

  var ui = $( "#fragments > .final_jeopardy_player tbody > .player" ).clone();


  if ( ! tv_player_number ) {

    data = { 'id' : this.id, 'name' : this.name, 'score' : this.get_score(), 'class' : 'live' };

    ui.find( '.player' ).text( data[ 'name' ] )

    ui.find( ".score input" ).val( data[ 'score' ] );

  }
  // if

  else {

   data = { 'id' : ( 100 + tv_player_number ), 'name' : ( 'TVplayer' + tv_player_number ), 'class' : 'tv' };

   ui.find( ".player input" ).val( data[ 'name' ] );

  }
  // else


  ui.addClass( data[ 'class' ] );

  ui.find( "input" ).each( function ( index, element ) {

    element.name = element.name.replace( /PLAYER_ID/, data[ 'id' ] );


    return;

  } );


  return ui;

};
// Player_UI.get_final_jeopardy_ui


Jeopardy.Player_UI.prototype.update_score = function ( score ) {

  this.parent.prototype.update_score.call( this, score );

  this.update_ui();


  return this.get_score();

};
// Player_UI.update_score
