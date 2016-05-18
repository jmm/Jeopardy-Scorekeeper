var Redux = require("redux");

/**
 * Manages a per-dispatch (e.g. per-store) cache of bound action creators.
 *
 * So that each store can have its own bound action creators with needlessly
 * rebinding all the time.
 */
var boundActionCreatorsCache = {
  get (opts = {}) {
    var cached;
    var {
      componentPath,
      dispatch,
      actionCreators,
    } = opts;

    dispatch.boundActionCreatorsCache = dispatch.boundActionCreatorsCache || {};

    cached = dispatch.boundActionCreatorsCache[componentPath] =
      dispatch.boundActionCreatorsCache[componentPath] ||
      Redux.bindActionCreators(actionCreators, dispatch);

    return cached;
  }
};

exports.boundActionCreatorsCache = boundActionCreatorsCache;
