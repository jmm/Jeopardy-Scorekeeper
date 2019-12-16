"use strict";

var key = "lastGame";

var storage;
if (typeof localStorage !== "undefined") storage = localStorage;

function set (state) {
  storage && storage.setItem(key, JSON.stringify(state));
}

function get () {
  return storage && JSON.parse(storage.getItem(key));
}

function remove () {
  storage && storage.removeItem(key);
}

var local = {
  set,
  get,
  remove,
};

exports.local = local;
