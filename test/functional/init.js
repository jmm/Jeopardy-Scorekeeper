"use strict";

// Have to do this before loading React, apparently.
var jsdom = require("jsdom");
setupDom();

function setupDom () {
  global.document = jsdom.jsdom(undefined, {
    virtualConsole: jsdom.createVirtualConsole().sendTo(console)
  });
  global.window = document.defaultView;
  global.navigator = window.navigator;
}
