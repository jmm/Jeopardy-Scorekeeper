"use strict";

require("dom4");

var init = require("./init");
var ReactDOM = require("react-dom");

var {element} = init.init();

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    element,
    document.getElementById("app")
  );
});
