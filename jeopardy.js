

/*

Copyright © 2010-2012 Jesse McCarthy <http://jessemccarthy.net/>

This file is part of the Jeopardy Scorekeeper software.  "JEOPARDY!"
is a trademark of Jeopardy Productions, Inc.  This software is not
endorsed by, sponsored by, or affiliated with Jeopardy Productions,
Inc.

This software may be used under the MIT (aka X11) license or
Simplified BSD (aka FreeBSD) license.  See LICENSE.

*/


$( document ).ready( function () {

  var jeopardy = new Jeopardy.Game_UI(

    [],

    {},

    {

      'display_clue_counts' : true

    }

  );


  return;

} );


var Jeopardy = {};
