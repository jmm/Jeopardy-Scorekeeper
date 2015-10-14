// For Babel v5 make sure there's always a `.default` export for CJS, even when
// there's only a default export.
// See https://github.com/babel/babel/issues/2047
module.exports = function (babel) {
  var visitors = {
    Program: function (node, parent, scope, file) {
      // Ugly hack courtesy:
      // @PSpSynedra
      // https://github.com/babel/babel/issues/1979#issuecomment-129935080
      file.moduleFormatter.hasNonDefaultExports = true;
    },
  };

  return new babel.Plugin("ensure-cjs-named-default-export", {
    visitor: visitors
  });
}
