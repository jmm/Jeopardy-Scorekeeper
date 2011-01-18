
/*

Copyright © 2010-2011 Jesse McCarthy <http://jessemccarthy.net/>

This file is part of the Jeopardy Scorekeeper software.  "JEOPARDY!" is a trademark of Jeopardy Productions, Inc.  This software is not endorsed by, sponsored by, or affiliated with Jeopardy Productions, Inc.

This software may be used under the MIT (aka X11) license or Simplified BSD
(aka FreeBSD) license.  See LICENSE.

*/


Jeopardy.Game_UI = function ( players, game_config, ui_config ) {

  var add_player = $( "#round_and_players .add_player" );

  add_player.click( $.proxy( this, 'add_player_ui' ) )

  if ( ! players.length ) {

    add_player.click();

  }
  // if


  this.ui_config = ui_config;


  this.parent.constructor.call( this, players, game_config );


  $( "#start_game" ).click( $.proxy( this, 'start_game' ) );

  $( "#end_round" ).click( $.proxy( this, 'end_round' ) );

  $( "#end_game, #final_jeopardy_dialog button.close" ).click( $.proxy( this, 'end_game' ) );


  $( "#players, #daily_double_dialog #wager_form" ).submit( function ( event ) {

    event.preventDefault();


    return;

  } );


  $( "#players input[type='text'], #daily_double_dialog #wager_form input[type='text']" ).live( 'keyup', $.proxy( this, 'handle_text_input_keyup' ) );


  $( "button" ).live( 'keyup', function ( event ) { event.preventDefault(); } );


  return;

};
// Game_UI


Jeopardy.Game_UI.prototype = new Jeopardy.Game;

Jeopardy.Game_UI.prototype.parent = Jeopardy.Game_UI.prototype.constructor.prototype;

Jeopardy.Game_UI.prototype.constructor = Jeopardy.Game_UI;


Jeopardy.Game_UI.prototype.player_class = Jeopardy.Player_UI.prototype;


Jeopardy.Game_UI.prototype.ui_config = {};


Jeopardy.Game_UI.prototype.dialog_stack = [];

Jeopardy.Game_UI.prototype.current_cell;

Jeopardy.Game_UI.prototype.default_focus_cell;


Jeopardy.Game_UI.prototype.require_confirm_leave_game = true;


/// Key Values Set from DOM Level 3 Events 6.2.7

Jeopardy.Game_UI.prototype.key_values = {

  'Up' : 38,

  'Down' : 40,

  'Left' : 37,

  'Right' : 39,

  'Tab' : 9,

  'Spacebar' : 32,

  'Enter' : 13

};


Jeopardy.Game_UI.prototype.nav_keys = {};

Jeopardy.Game_UI.prototype.nav_keys[ Jeopardy.Game_UI.prototype.key_values[ 'Up' ] ] = 'Up';

Jeopardy.Game_UI.prototype.nav_keys[ Jeopardy.Game_UI.prototype.key_values[ 'Down' ] ] = 'Down';

Jeopardy.Game_UI.prototype.nav_keys[ Jeopardy.Game_UI.prototype.key_values[ 'Left' ] ] = 'Left';

Jeopardy.Game_UI.prototype.nav_keys[ Jeopardy.Game_UI.prototype.key_values[ 'Right' ] ] = 'Right';

Jeopardy.Game_UI.prototype.nav_keys[ Jeopardy.Game_UI.prototype.key_values[ 'Tab' ] ] = 'Tab';


Jeopardy.Game_UI.prototype.current_dialog = function () {

  return this.dialog_stack[ this.dialog_stack.length - 1 ];

};
// current_dialog


Jeopardy.Game_UI.prototype.start_game = function ( event ) {

  if ( event ) {

    event.preventDefault();

  }
  // if

  var players;


  $( window ).bind( 'beforeunload', $.proxy( this, 'leave_game' ) );


  if ( $.isEmptyObject( this.players ) ) {

    if ( ! ( players = this.get_players() ).length ) {

      $( "#round_and_players .add_player" ).click();

      players = this.get_players();

    }
    // if


    this.set_players( players );

    players = this.players;

  }
  // if


  jeopardy = this;

  // Get config params
  $( "#game_config :input" ).each( function ( index, element ) {

    var param = element.name.match( /([^\[]+)\[([^\[]+)\]/ );

    var value = element.value;


    if ( $.inArray( param[2], [ 'deduct_incorrect_clue', 'deduct_incorrect_daily_double', 'display_clue_counts' ] ) != -1 ) {

      value = Boolean( value * 1 );

    }
    // if


    jeopardy[ param[1] ][ param[2] ] = value;


    element.disabled = true;


    return;

  } );


  this.parent.start_game.call( this );


  $( "#players input" ).change( $.proxy( this, 'update_player_info' ) );


  $( document ).bind( 'keydown keypress', $.proxy( this, 'ui_keyboard_nav' ) );

  $( ".dialog button" ).bind( 'keydown keypress', $.proxy( this, 'dialog_keyboard_nav' ) );


  var clue_dialog = $( "#clue_dialog" );

  clue_dialog.find( "button.right" ).data( 'correct', true );

  clue_dialog.find( "button.wrong" ).data( 'correct', false );

  clue_dialog.find( "button.right, button.wrong" ).click( $.proxy( this, 'finish_regular_clue' ) );

  clue_dialog.find( "button.cancel" ).click( $.proxy( this, 'cancel_clue' ) );

  clue_dialog.find( "button.skip" ).click( $.proxy( this, 'skip_clue' ) );

  clue_dialog.find( "button.daily_double" ).click( $.proxy( this, 'start_daily_double' ) );


  var dd_dialog = $( "#daily_double_dialog" );

  dd_dialog.find( "#wager_form input" ).keydown( $.proxy( this, 'dialog_keyboard_nav' ) );

  dd_dialog.find( "button.right" ).data( 'correct', true );

  dd_dialog.find( "button.wrong" ).data( 'correct', false );

  dd_dialog.find( "button.right, button.wrong" ).click( $.proxy( this, 'finish_daily_double' ) );

  dd_dialog.find( "button.cancel" ).click( $.proxy( this, 'cancel_daily_double' ) );

  dd_dialog.find( "button.skip" ).click( $.proxy( this, 'skip_daily_double' ) );


  dd_dialog.find( "#wager_form" ).bind( 'reset', function ( event ) {

    var form = $( this );

    setTimeout( function () {

      form.find( ".data_field input[name='wager']:checked" ).click();

    }, 1 );


    return;

  } );


  dd_dialog.find( ".data_field input[name='wager'][type='radio']" ).bind( 'click focus', function ( event ) {

    data_field = $( this ).closest( ".data_field" );

    var css_class = { 'click' : 'selected', 'focus' : 'focused' }[ event.type ];

    data_field.siblings( ".data_field" ).toggleClass( css_class, false );

    data_field.toggleClass( css_class, true );


    return;

  } );


  dd_dialog.find( ".data_field input[name='wager'][type='radio']" ).bind( 'blur', function ( event ) {

    data_field = $( this ).closest( ".data_field" );

    data_field.toggleClass( 'focused', false );


    return;

  } );


  var custom_wager = dd_dialog.find( ".data_field.wager-custom" );

  var custom_wager_text = custom_wager.find( "input[name='custom_wager']" );

  var custom_wager_radio = custom_wager.find( "input[type='radio']" );



  custom_wager_text.change( function ( event ) {

    custom_wager_radio.val( this.value );


    return;

  } );


  custom_wager_text.focus( function ( event ) {

    if ( ! custom_wager_radio[0].checked ) {

      custom_wager_radio.click();

    }
    // if


    else {

      $( this ).select();

    }
    // else


    return;

  } );


  custom_wager_radio.click( function ( event ) {

    custom_wager_text.select();


    return;

  } );


  $( "#board" ).toggleClass( 'enabled', true );


  $( "#round_and_players .add_player" ).hide();

  $( "#players .player .delete" )

      .removeClass( 'delete' )

      .addClass( 'set_has_control' )

      .find( "a" )

      .text( "Make Current" )

      .unbind( 'click' )

      .click( $.proxy( this, 'change_current_player_request' ) );


  $( "#setup_game" ).hide();

  $( "#admin_game" ).show();


  return;

};
// Game_UI.start_game


Jeopardy.Game_UI.prototype.get_players = function () {

  var players = [];

  $( "#players .player" ).each( function ( index, element ) {

    var player = {};

    if ( player.name = $( element ).find( ".name input" ).val() ) {

      player.score = $( element ).find( ".score input" ).val();

      players.push( player );

      $( element ).remove();

    }
    // if


    return;

  } );


  return players;

};
// Game_UI.get_players


Jeopardy.Game_UI.prototype.add_player = function ( player ) {

  this.parent.add_player.call( this, player );

  var player = this.players[ player.id ];


  if ( ! $( "#player-" + player.id ).length ) {

    this.add_player_ui( player );

  }
  // if

  else {

    player.update_ui();

  }
  // else


  return;

};
// add_player


Jeopardy.Game_UI.prototype.change_current_player = function ( player_id ) {

  this.parent.change_current_player.call( this, player_id );


  return;

};
// Game_UI.change_current_player


Jeopardy.Game_UI.prototype.change_current_player_request = function ( event ) {

  this.change_current_player( $( event.currentTarget ).closest( ".player" )[0].id.match( /[0-9]+$/ )[0] );


  event.preventDefault();


  return;

};
// Game_UI.change_current_player


Jeopardy.Game_UI.prototype.add_player_ui = function ( input ) {

  var event, player, player_id;

  if ( input instanceof this.player_class.constructor ) {

    player = input;

  }
  // if

  else {

    event = input;

    player_id = $( "#players .player:last" ).data( 'id' ) || 0;

    player_id++;

    player = { 'id' : player_id, 'name' : ( "Contestant" + player_id ) };

    player = new this.player_class.constructor( player );

  }
  // else


  var player_ui = player.get_ui();

  player_ui.find( ".delete a" ).click( $.proxy( this, 'delete_player_ui' ) );

  $( "#players" ).append( player_ui );

  if ( player_id ) {

    $( "#player-" + player.id + " .name input" ).select();

  }
  // if


  if ( event ) {

    event.preventDefault();

  }
  // if


  return;

};
// Game_UI.add_player_ui


Jeopardy.Game_UI.prototype.delete_player_ui = function ( event ) {

  $( event.currentTarget ).closest( ".player" ).remove();

  event.preventDefault();


  return;

};
// Game_UI.delete_player_ui


Jeopardy.Game_UI.prototype.init_round = function ( round ) {

  this.parent.init_round.call( this, round );


  var cell_html = $( "#fragments > #fragment-cell .cell" );

  var cell, cell_content;

  $( "#board .column" ).empty();


  // Single or Double Jeopardy

  if ( round <= 2 ) {

    var i;

    var clue_counts = [];

    for ( i in this.clue_counts[ round ] ) {

      // Omit daily double

      if ( isNaN( i ) ) {

        continue;

      }
      // if


      clue_counts.push( i );

    }
    // for

    clue_counts.sort( function ( a, b ) { return a - b; } );

    this.default_focus_cell = null;

    for ( i = 0 ; i < clue_counts.length ; ++i ) {

      var clue_value = clue_counts[ i ];

      cell = cell_html.clone();

      cell.data( 'clue_value', clue_value );

      cell_content = "$" + clue_value;

      if ( this.ui_config[ 'display_clue_counts' ] ) {

        cell_content += ' <span class="count">(' + this.clue_counts[ round ][ clue_value ] + ')</span>';

      }
      // if

      cell.find( "button .label" ).html( cell_content );

      cell.find( "button" ).click( $.proxy( this, 'start_clue' ) );

      cell.find( "button" ).bind( 'keydown keypress', $.proxy( this, 'board_keyboard_nav' ) );

      cell.find( "button" ).keyup( function ( event ) { event.preventDefault(); } );

      $( "#board .column" ).append( cell );

      if ( ! this.default_focus_cell && ( ( i + 1 ) / clue_counts.length ) >= 0.5  ) {

        this.default_focus_cell = cell;

        this.focus_default_cell();

      }
      // if

    }
    // for


    $( "#daily_doubles_remaining" ).show();

    $( "#daily_doubles_remaining .count" ).text( this.clue_counts[ this.current_round ][ 'daily_double' ] );

  }
  // if


  // Final Jeopardy

  else {

    $( "#end_round" ).toggleClass( 'enabled', false );

    $( "#daily_doubles_remaining" ).hide();

    this.start_final_jeopardy();

  }
  // else


  $( "#section-round .primary_section_heading" ).text( this.rounds[ round ] + " Jeopardy" );


  return;

};
// Game_UI.init_round


Jeopardy.Game_UI.prototype.end_game = function ( event ) {

  var dialog = $( "#end_dialog" );

  if ( dialog.is( ":visible" ) ) {

    dialog.find( "button" ).unbind( 'click' );

    this.close_dialog( 1 );


    if ( $( event.currentTarget ).hasClass( 'yes' ) ) {

      this.close_dialog( -1 );

      this.require_confirm_leave_game = false;

      window.location.assign( window.location.href );

    }
    // if

  }
  // if


  else {

    dialog.find( "button" ).click( $.proxy( this, 'end_game' ) );

    dialog.find( ".prompt" ).text( "Are you sure you want to end the game?" );

    this.open_dialog( dialog );

  }
  // else


  event.preventDefault();


  return;

};
// Game_UI.end_game


Jeopardy.Game_UI.prototype.end_round = function ( event ) {

  event.preventDefault();

  if ( this.current_round > 2 ) {

    return;

  }
  // if


  var dialog = $( "#end_dialog" );


  if ( dialog.is( ":visible" ) ) {

    dialog.find( "button" ).unbind( 'click' );

    this.close_dialog( -1 );


    if ( $( event.currentTarget ).hasClass( 'yes' ) && this.current_round < 3 ) {

      this.init_round( this.current_round + 1 );

    }
    // if

  }
  // if


  else {

    dialog.find( "button" ).click( $.proxy( this, 'end_round' ) );

    dialog.find( ".prompt" ).text( "Are you sure you want to end " + this.rounds[ this.current_round ] + " Jeopardy?" );

    this.open_dialog( dialog );

  }
  // else


  return;

};
// Game_UI.end_round



/**
 * Vertically center the regular clue / daily double dialog with respect to the current board cell.
 */

Jeopardy.Game_UI.prototype.position_dialog = function ( dialog ) {

  var game_ui = $( "#game_ui" );

  var board_top = $( "#board" ).offset()[ 'top' ];


  var pos = { 'top' : '', 'left' : '' };


  var pos_refs = {

    // Horizontal

    'h' : { 'ref' : game_ui.outerWidth( true ), 'multiple' : 1 },


    // Vertical

    'v' : { 'ref' : $( window ).height(), 'multiple' : -1 }

  };


  var current_cell = this.current_cell;


  if ( current_cell ) {

    pos.top = current_cell.position()[ 'top' ];

    pos_refs.v.ref = current_cell.outerHeight( true );

    pos_refs.v.multiple = -1;


    pos.left = current_cell.position()[ 'left' ];

    pos_refs.h.ref = current_cell.outerWidth( true );

    pos_refs.h.multiple = -1;

  }
  // if


  if (

    pos.top !== '' ||

    $( window ).height() < dialog.outerHeight( true ) ||

    $( window ).scrollTop() ||

    dialog.attr( 'id' ) == "final_jeopardy_dialog"

  ) {

    pos.top = Number( pos.top );

    if ( ! pos.top ) {

      pos.top += $( window ).scrollTop() - board_top;

    }
    // if

    pos.top += ( ( dialog.outerHeight( true ) - pos_refs.v.ref ) / 2 ) * pos_refs.v.multiple;

  }
  // if


  var bottom = board_top + Number( pos.top ) + dialog.outerHeight( true );


  if ( ( $( window ).height() + $( window ).scrollTop() ) < bottom ) {

    pos.top = Number( pos.top ) - ( bottom - ( $( window ).height() + $( window ).scrollTop() ) );

  }
  // if


  if ( pos.top !== '' ) {

    pos.top = Math.max( pos.top, ( $( window).scrollTop() - board_top ) );

  }
  // if



  if ( $( window ).width() < game_ui.outerWidth( true ) ) {

    pos.left = $( window ).scrollLeft();

    pos_refs.h.multiple = 1;

    pos_refs.h.ref = $( window ).width();


    if ( $( window ).width() < dialog.outerWidth( true ) ) {

      pos_refs.h.multiple = -1;

    }
    // if

  }
  // if


  pos.left = Number( pos.left ) + ( ( Math.abs( dialog.outerWidth( true ) - pos_refs.h.ref ) / 2 ) * pos_refs.h.multiple );


  dialog.css( pos );


  return;

};
// Game_UI.position_dialog


Jeopardy.Game_UI.prototype.start_clue = function ( event ) {

  var current_cell = $( event.currentTarget ).closest( ".cell" );

  this.current_cell = current_cell;


  this.parent.start_clue.call( this, current_cell.data( 'clue_value' ) );


  if ( ! (

    current_cell.hasClass( 'enabled' ) &&

    $( "#board" ).hasClass( 'enabled' )

  ) ) {

    event.preventDefault();

    return;

  }
  // if


  var clue_dialog = $( "#clue_dialog" );

  clue_dialog.find( ".prompt" ).text( "$" + current_cell.data( 'clue_value' ) );

  this.open_dialog( clue_dialog );


  var toggle_on = false;

  if ( this.clue_counts[ this.current_round ][ 'daily_double' ] > 0 ) {

    toggle_on = true;

  }
  // if

  clue_dialog.find( "button.daily_double" ).toggle( toggle_on );


  event.preventDefault();


  return;

};
// Game_UI.start_clue


Jeopardy.Game_UI.prototype.start_daily_double = function ( event ) {

  event.preventDefault();


  this.parent.start_daily_double.call( this );


  var dd_dialog = $( "#daily_double_dialog" );

  dd_dialog.find( "form" )[0].reset();

  var wagers = {

    'minimum' : this.min_daily_double_wager,

    'natural' : this.current_clue,

    'maximum' : this.current_max_clue_value,

    'true' : false

  };


  if ( this.current_player.get_score() >= this.current_max_clue_value ) {

    wagers[ 'maximum' ] = false;

    wagers[ 'true' ] = this.current_player.get_score();

  };


  $.each( wagers, function ( index, element ) {

    var data_item = dd_dialog.find( ".data_field.wager-" + index );


    if ( element === false ) {

      data_item.toggle( false );

      return;

    }
    // if

    data_item.toggle( true );


    data_item.find( "input[name='wager']" ).val( element );

    element = "$" + element;

    element = element.replace( /^$-/, "-$$" );

    data_item.find( "label .wager" ).text( element );

    return;

  } );


  this.open_dialog( dd_dialog, true );


  return;

};
// Game_UI.start_daily_double


Jeopardy.Game_UI.prototype.finish_daily_double = function ( event ) {

  event.preventDefault();

  var correct = $( event.currentTarget ).data( 'correct' );

  var wager = $( "#wager_form input[name='wager']:checked" ).val();

  this.parent.finish_daily_double.call( this, correct, wager );


  $( "#daily_doubles_remaining .count" ).text( this.clue_counts[ this.current_round ][ 'daily_double' ] );


  return;

};
// Game_UI.finish_daily_double


Jeopardy.Game_UI.prototype.skip_daily_double = function ( event ) {

  event.preventDefault();

  this.parent.skip_daily_double.call( this );


  $( "#daily_doubles_remaining .count" ).text( this.clue_counts[ this.current_round ][ 'daily_double' ] );


  return;

};
// Game_UI.skip_daily_double


Jeopardy.Game_UI.prototype.cancel_daily_double = function ( event ) {

  event.preventDefault();


  this.close_dialog( 1 );


  return;

};
// Game_UI.cancel_daily_double


Jeopardy.Game_UI.prototype.update_board = function () {

  var clue_count;

  var cell = this.current_cell;

  clue_count = this.clue_counts[ this.current_round ][ cell.data( 'clue_value' ) ]

  cell.find( ".count" ).text( "(" + clue_count + ")" );


  if ( ! clue_count ) {

    cell.toggleClass( 'enabled', false );

  }
  // else


  return;

};
// Game_UI.update_board


Jeopardy.Game_UI.prototype.finish_regular_clue = function ( event ) {

  event.preventDefault();

  var correct = $( event.currentTarget ).data( 'correct' );

  this.parent.finish_regular_clue.call( this, correct );


  return;

};
// Game_UI.finish_regular_clue


Jeopardy.Game_UI.prototype.finish_clue = function ( correct, score_addend ) {

  this.parent.finish_clue.call( this, correct, score_addend );


  this.update_board();

  this.dismiss_clue();


  return;

};
// Game_UI.finish_clue


Jeopardy.Game_UI.prototype.skip_clue = function ( event ) {

  if ( event ) {

    event.preventDefault();

  }
  // if

  this.parent.skip_clue.call( this );


  return;

};
// Game_UI.skip_clue


Jeopardy.Game_UI.prototype.cancel_clue = function ( event ) {

  event.preventDefault();

  this.parent.cancel_clue.call( this );

  this.dismiss_clue();


  return;

};
// Game_UI.cancel_clue


Jeopardy.Game_UI.prototype.dismiss_clue = function () {

  this.close_dialog( -1 );

  this.current_cell = null;

  this.focus_default_cell();


  return;

};
// Game_UI.dismiss_clue


Jeopardy.Game_UI.prototype.populate_final_jeopardy_players_form = function ( event ) {

  var i, player, tv_player_number = 0;

  var fj_dialog = $( "#final_jeopardy_dialog" );

  var players = fj_dialog.find( ".players" );

  players.empty();


  for ( i = 0 ; i < ( this.player_order.length + this.num_tv_players ) ; ++i ) {

    if ( i < this.player_order.length ) {

      player = this.players[ this.player_order[ i ] ]

    }
    // if

    else {

      player = this.player_class;

      ++tv_player_number;

    }
    // else


    players.append( player.get_final_jeopardy_ui( tv_player_number ) );

  }
  // for


  players.find( "input" ).keydown( $.proxy( this, 'final_jeopardy_keyboard_nav' ) );


  players.find( ".correct .right input" ).bind( "focus blur", function ( event ) {

    var toggle_on = ( event.type == 'focus' ? true : false );

    $( this ).closest( "label" ).toggleClass( 'focused', toggle_on );


    return;

  } );


  if ( event ) {

    event.preventDefault();

  }
  // if


  return;

};
// Game_UI.populate_final_jeopardy_players_form


Jeopardy.Game_UI.prototype.start_final_jeopardy = function () {

  var fj_dialog = $( "#final_jeopardy_dialog" );


  this.populate_final_jeopardy_players_form();


  fj_dialog.find( "#final_jeopardy_form" ).bind( 'reset', $.proxy( this, 'populate_final_jeopardy_players_form' ) );


  fj_dialog.find( "button.finish" ).click( $.proxy( this, 'finish_final_jeopardy' ) );


  this.open_dialog( fj_dialog );


  return;

}
// Game_UI.start_final_jeopardy


Jeopardy.Game_UI.prototype.finish_final_jeopardy = function ( event ) {

  var players = [];

  $( "#final_jeopardy_dialog .players_table tr.player" ).each ( function ( index, element ) {

    players.push( {

      'correct' : Boolean( $( element ).find( ".correct input:checked" ).val() ),

      'score' : Number( $( element ).find( ".score.before input" ).val() ),

      'wager' : Number( $( element ).find( ".wager input" ).val() )

    } );


    return;

  } );


  this.parent.finish_final_jeopardy.call( this, players );


  $( "#final_jeopardy_dialog .players_table tr.player" ).each ( function ( index, element ) {

    $( element ).find( ".score.after" ).text( players[ index ][ 'score' ] );


    return;

  } );


  return;

};
// Game_UI.finish_final_jeopardy


Jeopardy.Game_UI.prototype.final_jeopardy_keyboard_nav = function ( event ) {

  var jq_targ = $( event.currentTarget );

  var nav_key, nav_keys = this.nav_keys;

  nav_key = nav_keys[ event.which ];


  var nav_event = {

    'Up' : { 'key' : 'Up', 'dir' : 'prev', 'sibling_offset' : 1, 'is_arrow' : true },

    'Down' : { 'key' : 'Down', 'dir' : 'next', 'sibling_offset' : 1, 'is_arrow' : true },

    'Left' : { 'key' : 'Left', 'dir' : 'prev', 'sibling_offset' : 0, 'is_arrow' : true },

    'Right' : { 'key' : 'Right', 'dir' : 'next', 'sibling_offset' : 0, 'is_arrow' : true },

    'Tab' : { 'key' : 'Tab', 'dir' : ( event.shiftKey ? 'prev' : 'next' ), 'sibling_offset' : 0, 'is_arrow' : false }

  }[ nav_key ];


  var sibling, class_names;


  if ( nav_event ) {

    if ( nav_event[ 'is_arrow' ] && ! jq_targ.is( 'input' ) ) {

      event.preventDefault();

    }
    // if


    if ( ! $( event.currentTarget ).closest( ".dialog" ).length ) {

      this.current_dialog().find( "tr.player.tv:first .score.before input" ).eq( 0 ).focus();

      event.preventDefault();

    }
    // if


    else if ( jq_targ.is( 'input' ) && $.inArray( nav_key, [ 'Up', 'Down' ] ) != -1 ) {

      class_names = jq_targ.closest( "td" )[0].className.replace( " ", "." );

      sibling = jq_targ.closest( "tr" )[ nav_event[ 'dir' ] + "All" ]( ":not( .disabled ):first" ).find( "td." + class_names + " input" );

      if ( sibling.length ) {

        // DEBUG jQuery.blur() / focus() dont work properly in 1.4.4.  See http://bugs.jquery.com/ticket/7891
        sibling[0].focus();

      }
      // if

    }
    // else if


    else if (

      nav_key == 'Tab' &&

      (

        ( ! event.shiftKey && jq_targ.is( "button" ) && ! jq_targ.next( "button:visible" ).length ) ||

        (

          event.shiftKey &&

          (

            jq_targ.closest( ".dialog" ).find( "input:first" ).get( 0 ) == jq_targ[0] ||

            jq_targ.closest( ".dialog" ).find( "input:not([tabindex='-1']):first" ).get( 0 ) == jq_targ[ 0 ]

          )

        )

      )

    ) {

      event.preventDefault();

    }
    // else if

  }
  // if


  event.stopPropagation();


  return;

};
// Game_UI.final_jeopardy_keyboard_nav


Jeopardy.Game_UI.prototype.open_dialog = function ( dialog ) {

  if ( this.dialog_stack.length ) {

    this.dialog_stack[ this.dialog_stack.length - 1 ].toggle( false );

  }
  // if


  else {

    $( "#greater_dialog" ).toggle( true );

  }
  // else


  this.dialog_stack.push( dialog );

  if ( this.current_cell ) {

    this.current_cell.find( "button" ).blur();

  }
  // if

  $( "#board" ).toggleClass( 'enabled', false );

  dialog.toggle( true );

  this.position_dialog( dialog );


  return;

};
// Game_UI.open_dialog


Jeopardy.Game_UI.prototype.close_dialog = function ( count ) {

  var dialog;

  count = ( count == -1 ? this.dialog_stack.length : count );

  while ( count && this.dialog_stack.length ) {

    dialog = this.dialog_stack.pop();

    dialog.toggle( false );

    dialog.css( { 'top' : "", 'left' : "" } );

    --count;

  }
  // while


  if ( this.dialog_stack.length ) {

    this.dialog_stack[ this.dialog_stack.length - 1 ].toggle( true );

  }
  // if


  else {

    $( "#greater_dialog" ).toggle( false );

    $( "#board" ).toggleClass( "enabled", true );

  }
  // else


  return;

};
// Game_UI.close_dialog


Jeopardy.Game_UI.prototype.ui_keyboard_nav = function ( event ) {

  if ( this.handle_keyboard_nav_keypress( event ) ) {

    return;

  }
  // if


  if ( this.current_dialog() ) {

    if ( this.current_dialog().attr( 'id' ) == 'final_jeopardy_dialog' ) {

      this.final_jeopardy_keyboard_nav( event );

    }
    // if


    else {

      this.dialog_keyboard_nav( event );

    }
    // else

  }
  // if


  return;

};
// Game_UI.ui_keyboard_nav


Jeopardy.Game_UI.prototype.board_keyboard_nav = function ( event ) {

  if ( this.handle_keyboard_nav_keypress( event ) ) {

    return;

  }
  // if

  var nav_keys = {};

  nav_keys[ this.key_values[ 'Up' ] ] = 'Up';
  nav_keys[ "z".charCodeAt( 0 ) ] = 'Up';
  nav_keys[ "Z".charCodeAt( 0 ) ] = 'Up';

  nav_keys[ this.key_values[ 'Down' ] ] = 'Down';
  nav_keys[ "x".charCodeAt( 0 ) ] = 'Down';
  nav_keys[ "X".charCodeAt( 0 ) ] = 'Down';


  var nav_events = { 'Up' : 'prev', 'Down' : 'next' };

  var nav_event = nav_events[ nav_keys[ event.which ] ];

  var sibling;


  if ( nav_event ) {

    sibling = $( event.currentTarget ).closest( '.cell' )[ nav_event ]();

    if ( sibling.length ) {

      sibling.find( 'button' ).focus();

    }
    // if


    event.preventDefault();

    event.stopPropagation();

  }
  // if


  else if ( event.which == this.key_values[ 'Spacebar' ] ) {

    event.preventDefault();

    event.stopPropagation();

    $( event.currentTarget ).click();

  }
  // else if


  return;

};
// Game_UI.board_keyboard_nav


Jeopardy.Game_UI.prototype.dialog_keyboard_nav = function ( event ) {

  if ( this.handle_keyboard_nav_keypress( event ) ) {

    return;

  }
  // if


  var current_dialog = this.current_dialog();


  var jq_targ = $( event.currentTarget );

  var nav_key, nav_keys = this.nav_keys;

  nav_key = nav_keys[ event.which ];


  var nav_event = {

    'Up' : { 'key' : 'Up', 'dir' : 'prev', 'sibling_offset' : 1 },

    'Left' : { 'key' : 'Left', 'dir' : 'prev', 'sibling_offset' : 0 },

    'Down' : { 'key' : 'Down', 'dir' : 'next', 'sibling_offset' : 1 },

    'Right' : { 'key' : 'Right', 'dir' : 'next', 'sibling_offset' : 0 },

    'Tab' : { 'key' : 'Tab', 'dir' : ( event.shiftKey ? 'prev' : 'next' ), 'sibling_offset' : 0 }

  }[ nav_key ];


  var siblings, new_active_element;


  if ( nav_event ) {

    if ( jq_targ.is( 'button' ) ) {

      siblings = jq_targ[ nav_event[ 'dir' ] + "All" ]( "button:visible" );

      var targ_offset = jq_targ.offset();

      siblings.each( function ( index, element ) {

        var curr_offset = $( element ).offset();

        if (

          (

            $.inArray( nav_key, [ 'Left', 'Right', 'Tab' ] ) != -1

          )

          ||

          (

            $.inArray( nav_key, [ 'Up', 'Down' ] ) != -1 &&

            curr_offset[ 'top' ] != targ_offset[ 'top' ] &&

            curr_offset[ 'left' ] == targ_offset[ 'left' ]

          )

        ) {

          new_active_element = $( element );

          return false;

        }
        // if


        return;

      } );


      if ( ! new_active_element ) {

        if (

          ( nav_key == 'Up' || ( nav_key == 'Tab' && event.shiftKey ) ) &&

          current_dialog.attr( 'id' ) == 'daily_double_dialog' &&

          current_dialog.find( "button" ).index( event.currentTarget ) == 0

        ) {

          new_active_element = current_dialog.find( "input[name='wager']:last:visible" );

        }
        // if


        else if ( current_dialog.attr( 'id' ) == 'final_jeopardy_dialog' ) {

          return this.final_jeopardy_keyboard_nav( event );

        }
        // else if

      }
      // if

    }
    // if


    else if ( jq_targ[0].form ) {

      new_active_element = jq_targ.closest( ".data_field_wager" )[ nav_event[ 'dir' ] + "All" ]( ".data_field_wager:visible" ).eq( 0 ).find( "input[name='wager']" );

      if (

        ! new_active_element.length &&

        nav_event[ 'dir' ] == 'next'

      ) {

        new_active_element = current_dialog.find( "button:first" );

      }
      // if

    }
    // else if


    else {

      var selectors = [

        ".data_field_wager:last:visible input[name='wager']",

        "button.skip:visible",

        "button:visible"

      ];

      $.each( selectors, function ( index, selector ) {

        new_active_element = current_dialog.find( selector );

        if ( new_active_element.length ) {

          return false;

        }
        // if

      } );

    }
    // else


    if ( new_active_element && new_active_element.length ) {

      // DEBUG jQuery.focus() prevents blur event from firing in 1.4.4.  See http://bugs.jquery.com/ticket/7891
      new_active_element[0].focus();

    }
    // if


    event.stopPropagation();

    event.preventDefault();

  }
  // if


  else if ( $.inArray( event.which, [ this.key_values[ 'Enter' ], this.key_values[ 'Spacebar' ] ] ) != -1 ) {

    event.stopPropagation();

    event.preventDefault();

    jq_targ.click();


    if ( jq_targ.is( "button" ) ) {

      jq_targ.blur();

    }
    // if


    else if (

      jq_targ.is( "input[type='text']" ) &&

      event.which == this.key_values[ 'Enter' ]

    ) {

      // DEBUG jQuery.focus() prevents change event from firing in 1.4.4.  See http://bugs.jquery.com/ticket/7891
      jq_targ.closest( ".data_field" ).find( "input[type='radio']" )[0].focus();

    }
    // else if

  }
  // else if


  return;

};
// Game_UI.dialog_keyboard_nav


/**
 * To get Opera to stop scrolling on up / down arrow, spacebar.
 */

Jeopardy.Game_UI.prototype.handle_keyboard_nav_keypress = function ( event ) {

  if ( event.type == 'keypress' ) {

    if ( $.inArray( event.keyCode, [

      this.key_values[ 'Up' ],

      this.key_values[ 'Down' ],

      this.key_values[ 'Spacebar' ]

    ] ) != -1 ) {

      event.preventDefault();

    }
    // if

    return true;

  }
  // if


  return;

};
// Game_UI.handle_keyboard_nav_keypress


Jeopardy.Game_UI.prototype.handle_text_input_keyup = function ( event ) {

  if ( event.which == this.key_values[ 'Enter' ] ) {

    $( event.currentTarget ).blur();

    if (

      $( event.currentTarget ).closest( ".player" ).length &&

      this.default_focus_cell

    ) {

      this.focus_default_cell();

    }
    // if

  }
  // if


  return;

};
// Game_UI.handle_text_input_keyup


Jeopardy.Game_UI.prototype.focus_default_cell = function ( event ) {

  this.default_focus_cell.find( "button" ).focus();


  return;

};
// Game_UI.focus_default_cell




Jeopardy.Game_UI.prototype.update_player_info = function ( event ) {

  var target = $( event.currentTarget );

  var player = target.closest( ".player" );

  player = this.players[ player[0].id.match( /[0-9]+$/ )[0] ];

  player.update_info( event.currentTarget );


  return;

};
// Game_UI.update_player_info


Jeopardy.Game_UI.prototype.leave_game = function ( event ) {

  if ( ! this.require_confirm_leave_game ) {

    return;

  }
  // if


  var message = "Your current game will be lost if you leave this page."

  event.returnValue = message;


  return event.returnValue;

};
// Game_UI.leave_game
