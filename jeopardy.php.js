<?php

/*

Copyright © 2010-2011 Jesse McCarthy <http://jessemccarthy.net/>

This file is part of the Jeopardy Scorekeeper software.  "JEOPARDY!" is a trademark of Jeopardy Productions, Inc.  This software is not endorsed by, sponsored by, or affiliated with Jeopardy Productions, Inc.

This software may be used under the MIT (aka X11) license or Simplified BSD
(aka FreeBSD) license.  See LICENSE.

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


echo join( "\n\n\n", $scripts );


/* EOF */