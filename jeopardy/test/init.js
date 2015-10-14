var
  fs = require('fs'),
  path = require('path'),
  init;

var cfg;

(function kludge (cfg) {
  // Loading the cfg here and passing to the require hook is a kludge, necessary
  // because of:
  // https://github.com/babel/babel/issues/2443
  // Also, .babelrc in general isn't necessarily JSON. See:
  // https://github.com/babel/babel.github.io/issues/455
  cfg = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', '.babelrc'),
    {encoding: 'utf8'}
  ));

  cfg.ignore = cfg.ignore || [];
  cfg.ignore.push('**/node_modules/**');

  // This plugin stuff necessary to work around:
  // https://github.com/babel/babel/issues/2443
  // https://github.com/babel/babel/issues/2491
  cfg.plugins = (cfg.plugins || []).map(function (id) {
    return require(id);
  });

  // This is necessary so that the .babelrc manually loaded above doesn't get
  // loaded via Babel's normal mechanism. This is undocumented. Ugh.
  cfg.breakConfig = true;
})(cfg);

require('babel-core/register')(cfg);

init = require('jeopardy/lib/init').init;

beforeEach(function () {
  // Reset app global stuff, like the event publisher.
  init();
});
