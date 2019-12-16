"use strict";

var glob = require("globby");

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

const typeIdWhitelist = ["unit", "functional"];

// Temporarily omit `prop-types` until issues with new warnings and moved
// packages can be resolved.
const filteredTypes = types.filter(typeId =>
  typeIdWhitelist.includes(typeId)
);

var typesPatt = filteredTypes.map(function (type) {
  return mapTypeToDir[type] || type;
})
.join(",");

if (filteredTypes.length > 1) {
  typesPatt = "{" + typesPatt + "}";
}

require("./init.js");
require("../relatively.js");

glob(
  ["init", "*.spec"].map(basename =>
    [__dirname, typesPatt, "**", `${basename}.js`].join("/")
  )
)
.then(function (files) {
  files.forEach(require);
})
.catch(function (e) {
  console.log(e.stack);
  process.exitCode = 1;
});
