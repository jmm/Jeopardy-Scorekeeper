<?php

/*

Copyright © 2010-2012 Jesse McCarthy <http://jessemccarthy.net/>

This file is part of the Jeopardy Scorekeeper software.  "JEOPARDY!"
is a trademark of Jeopardy Productions, Inc.  This software is not
endorsed by, sponsored by, or affiliated with Jeopardy Productions,
Inc.

This software may be used under the MIT (aka X11) license or
Simplified BSD (aka FreeBSD) license.  See LICENSE.


Concatenate JS files.

*/

header( "Content-Type: text/javascript" );

$scripts = array(

  'jeopardy',

  'jeopardy-player',

  'jeopardy-player-ui',

  'jeopardy-game',

  'jeopardy-game-ui'

);
// array


foreach ( $scripts as $s_key => $script ) {

  $scripts[ $s_key ] = file_get_contents( "{$script}.js" );

}
// foreach


$scripts = explode( "\n", join( "\n\n\n", $scripts ) );

$indenter = function( $value ) {

  if ( preg_match( "/\\S/", $value ) ) {

    $value = "  {$value}";

  }
  // if


  return $value;

};

$scripts = array_map( $indenter, $scripts );

$scripts = join( "\n", $scripts );


// Wrap in IIFE

echo <<<DOCHERE

( function () {

  "use strict";

{$scripts}

} )();

DOCHERE;
