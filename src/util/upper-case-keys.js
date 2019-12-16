"use strict";

module.exports = function (obj) {
  Object.keys(obj).forEach(key => {
    if (/[a-z]/.test(key)) {
      obj[key.toUpperCase()] = obj[key];
      delete obj[key];
    }
  });

  return obj;
};
