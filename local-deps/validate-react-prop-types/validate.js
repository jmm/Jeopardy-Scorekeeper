/*
Validate a React element's props against the component's propTypes.
*/

var assign = Object.assign;
var React = require("react");

var errMsgSignature = "Failed propType: ";

module.exports = validate;

/**
 * Validate props for an element.
 *
 * @param object|function element A ReactElement or plain object with the same
 *        shape (type, props), or a thunk. Passing a plain object, or thunk that
 *        calls createElement() & opts.quiet, is useful for silencing React's
 *        normal warnings that are emitted when calling createElement()
 *        (directly or via JSX).
 *
 * @param object opts Options
 *        Array<string|Array<string>> opts.whitelist A top-level property key
 *        or a property path. When whitelist is specified non-whitelisted props
 *        won't be validated.
 *
 *        bool opts.quiet Squelch React's usual console noise.
 */
function validate (element, opts) {
  opts = opts || {};

  if (opts.quiet) quiet();

  if (typeof element === "function") element = element();

  var type = element.type;
  var props = element.props;
  var err;
  var result = {};
  result.throw = throwYourself.bind(result);

  var each = typeof opts.each === "function" ? opts.each : null;

  if (each) {
    var eachResults = [];
  }

  var whitelist = opts.whitelist;

  Object.keys(type.propTypes || {}).some(function (prop) {
    var current = {
      props: assign(props),
      type: type,
      path: null,
    };

    var whitelisted = false;

    (whitelist || []).some(function (item) {
      if (Array.isArray(item)) {
        current.path = item;
        item.forEach(function (key, i, arr) {
          prop = key;

          if (i < arr.length - 1) {
            current.props = current.props[prop];
            current.type = current.type.propTypes[prop];
          }
        });
        whitelisted = true;
      }
      else whitelisted = item === prop;

      return whitelisted;
    });

    if (whitelist && !whitelisted) return;

    var validatorArgs = [
      current.props,
      prop,
      type.displayName || type.name,
      "prop",
    ];

    try {
      err = current.type.propTypes[prop].apply(null, validatorArgs);
    }
    catch (e) {
      if (e.message.indexOf(errMsgSignature) >= 0) err = e;
      else throw e;
    }

    if (err && err.message) {
      var newMessage = errMsgSignature + err.message;
      if (current.path) {
        newMessage = newMessage.replace(
          "`" + prop + "`",
          "`" + current.path.join(".") + "`"
        );
      }
      if (err.stack && err.stack.indexOf(err.message) >= 0) {
        err.stack = err.stack.replace(err.message, newMessage);
      }
      err.message = newMessage;
    }

    if (each) {
      var result = each(prop, err);
      if (result) eachResults.push(result);
      return result === false;
    }
    else if (err) {
      err.code = "REACT:PROP_TYPE_VALIDATION";
      err.react = {
        prop: current.path || prop,
      };
    }

    return err;
  });

  if (opts.quiet) unquiet();

  if (typeof opts.done === "function") {
    return opts.done(eachResults);
  }
  else if (err) {
    result.error = err;
  }

  result.valid = !err;

  return result;
}

/**
 * Convenience method for throwing if validation result is an error.
 *
 * This is useful in conjunction with throw assertions.
 */
function throwYourself () {
  if (this.error) throw this.error;
}

// This module has muted console output?
var quieted = false;

/**
 * Mute console output.
 */
function quiet () {
  if (quieted) return;
  quieted = console.error;
  console.error = function (msg) {
    if (msg.indexOf(errMsgSignature) < 0) return quieted.apply(this, arguments);
  };
}

/**
 * Unmute console output.
 */
function unquiet () {
  if (quieted) console.error = quieted;
  quieted = false;
}

/**
 * Return a validate function with certain options bound.
 *
 * @param object customOpts Options.
 */
function factory (customOpts) {
  var baseValidator = validate;
  var customValidator = function validate (element, opts) {
    return baseValidator.call(this, element, assign({}, opts, customOpts));
  };

  defineQuietGetter(customValidator);
  return customValidator;
}

validate.factory = factory;

var quietedValidator = factory({quiet: true});

/**
 * Mute console output and return validate function.
 */
function quietGetter () {
  quiet();
  return quietedValidator;
}

[
  validate,
  quietedValidator,
].forEach(defineQuietGetter);

function defineQuietGetter (target) {
  Object.defineProperty(target, "quiet", {
    get: quietGetter
  });
}
