"use strict";

var assign = require("object-assign");
var React = require("react");

module.exports = createReactComponentClass;

function createReactComponentClass (opts, parent) {
  parent = parent || React.Component;
  var ctor = opts.constructor;
  delete opts.constructor;

  var klass = function (props) {
    parent.call(this, props);
    this.superKlass = parent;
    if (ctor) ctor.call(this, props);
  };

  klass.prototype = Object.create(parent.prototype);

  klass.prototype.constructor = klass;

  assign(klass.prototype, opts);

  return klass;
}
