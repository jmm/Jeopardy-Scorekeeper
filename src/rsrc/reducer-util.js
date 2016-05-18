"use strict";

var assign = require("object-assign");

function factory (opts) {
  var previous = opts.previous || {};
  var customFactory = opts.factory || previous.factory;
  var defaultState = opts.state || previous.state;

  var path = opts.path || previous.path || [];

  // Sub reducers that'll comprise the returned reducer.
  var reducers = {
    actions: previous.actions || {},
    slices: previous.slices || {},
    detached: previous.detached || {},
  };

  getReduce.reducers = reducers;

  var currentGetReducer = opts.getReducer || previous.getReducer;
  if (!path.length) {
    currentGetReducer = getReducer.bind({reducers});
  }

  var custom = assign({
    actions: {},
    slices: {},
    detached: {},
  }, opts);

  var childFactoryOpts = assign({
    getReducer: currentGetReducer,
  });

  reducers.actions = customizeActions(
    reducers.actions, custom.actions, childFactoryOpts
  );

  reducers.detached = customizeActions(
    reducers.detached, custom.detached, childFactoryOpts
  );

  Object.keys(custom.slices || []).forEach(function (key) {
    var original = reducers.slices[key];
    var customization = custom.slices[key];
    var slice;
    var sliceOpts;

    if (customization.factory) {
      slice = customization;
      sliceOpts = {original};
    }
    else {
      slice = original;
      sliceOpts = customization;
    }

    if (slice.factory) {
      slice = slice.factory(assign({
        getReducer: currentGetReducer,
      }, sliceOpts));
    }
    else slice = slice.reducer;

    reducers.slices[key] = slice;
  });

  var sliceKeys = Object.keys(reducers.slices);

  /**
   * Default reducer for vanilla logic.
   * When a caller needs to do something like call getReducer() or the original
   * reducer it's overridden it can pass opts.factory to get access to it and
   * return a reducer. Otherwise it can get this back as its reducer.
   */
  function reduce (state = defaultState, action) {
    var handler;

    handler = action && reducers.actions[action.type];
    if (handler) state = handler.reducer(state, action);

    sliceKeys.forEach(function (slice) {
      var sliceState = reducers.slices[slice].reducer(state[slice], action);
      if (sliceState !== state[slice]) {
        state = assign({}, state, {
          [slice]: sliceState,
        });
      }
    });

    return state;
  }

  if (customFactory) reduce = customFactory(assign({
    original: {reducer: reduce},
    getReducer: currentGetReducer,
  }, reducers));

  /**
   * Create a proxy that can be passed to children before factory() is called,
   * which can't be done until sub reducers have been constructed.
   */
  function getReduce () {
    return reduce.apply(this, arguments);
  }

  // For debugging purposes if nothing else.
  getReduce.path = path;

  // This is the top level reducer.
  if (!path.length) {
    getReduce.customize = customize;
    getReduce.getReducer = currentGetReducer;
  }

  var base = {factory};

  // Propagate certain options through future factory calls.
  base.previous = assign({}, reducers, {
    getReducer: currentGetReducer,
    state: defaultState,
    factory: customFactory,
  });

  return {
    reducer: getReduce,
    factory: function factory (opts) {
      return base.factory(assign({}, {previous: base.previous}, opts));
    },
  };
}

exports.factory = factory;

// TODO: look into memoizing results of this.
/**
 * Return a function w/ reducer sig. that gets a handler and returns its result.
 *
 * Get a handler using action.type and call it on arguments.
 *
 * @param object actions Hash of reducers keyed by action types.
 *
 * @return function Reducer
 */
function actionGetterFactory(actions) {
  return function (state, action) {
    return actions[action.type].reducer(state, action);
  };
}

/**
 * Retrieve a reducer by specified slice path &&|| actionType.
 *
 * If `path` and `actionType are supplied, retrieve the action handler from The
 * reducer at `path`. E.g. getReducer(["x"], "Y").
 *
 * If `path` is omitted and `actionType` is supplied, retrieve `actionType` from
 * the root reducer. E.g. getReducer("Y");
 *
 * If `path` is supplied and `actionType` is omitted, return a function with
 * reducer signature that will get the action handler from action.type and pass
 * through its result. E.g. getReducer(["x"])(state, {type: "Y"}).
 *
 * To retrieve a detached reducer pass `null` for `path`. E.g.
 * getReducer(null, "Z").
 *
 * To retrieve a slice reducer pass `path` and `null` for `actionType`. E.g.
 * getReducer(["x"], null.
 *
 * @param Array|null path? Array of keys to ID a slice or omitted to indicate
 *   root or null to indicate a detached handler.
 * @param string|null actionType? String action type or null if retrieving a
 *   slice reducer.
 *
 * @return function Reducer.
 */
function getReducer (path, actionType) {
  var reducer = this;

  if (typeof path === "string") {
    actionType = path;
    path = undefined;
  }
  else if (path === null) {
    if (actionType) return reducer.reducers.detached[actionType].reducer;
    else {
      return actionGetterFactory(reducer.reducers.detached);
    }
  }

  path = path || [];
  if (!Array.isArray(path)) path = [path];

  path.forEach(function (slice) {
    reducer = reducer.reducers.slices[slice];
  });
  if (actionType) reducer = reducer.reducers.actions[actionType];
  else if (actionType !== null) {
    return actionGetterFactory(reducer.reducers.actions);
  }
  return reducer.reducer;
}

function customize (path, actions) {
  if (!actions) {
    actions = path;
    path = undefined;
  }

  var reducer = getReducer.call(this, path);

  reducer.reducers.actions = customizeActions(
    reducer.reducers.actions,
    actions,
    {
      getReducer: this.getReducer,
    }
  );
}

function customizeActions (base, custom, opts) {
  var reducers = assign({}, base);

  Object.keys(custom || []).forEach(function (type) {
    var reducer = custom[type];
    var factoryOpts = {
      getReducer: opts.getReducer,

      original: reducers[type],
    };

    if (reducer.factory) reducer.reducer = reducer.factory(factoryOpts);

    reducers[type] = reducer;
  });

  return reducers;
}
