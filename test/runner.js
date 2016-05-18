"use strict";

var glob = require("globby");
var tape = require("tape");

var types;
var optName = "--types=";

process.argv.some(function (item) {
  if (item.indexOf(optName) === 0) {
    types = item.trim().split(optName)[1].split(",");
  }
});

if (!types) throw Error("No test types specified.");

var mapTypeToDir = {
  "prop-types": "validate-prop-types",
};

var typesPatt = types.map(function (type) {
  return mapTypeToDir[type] || type;
});

typesPatt = typesPatt.join(",");

if (types.length > 1) {
  typesPatt = "{" + typesPatt + "}";
}

require("./init.js");
require("../relatively.js");

glob([__dirname, typesPatt, "**", "init.js"].join("/"))
.then(function (files) {
  files.forEach(require);
  return glob([__dirname, typesPatt, "**", "*.spec.js"].join("/"));
})
.then(function (files) {
  files.forEach(require);
})
.catch(function (e) {
  console.log(e.stack);
  process.exitCode = 1;
});
