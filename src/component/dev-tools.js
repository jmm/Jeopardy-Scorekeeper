"use strict";

const React = require("react");
const {createDevTools} = require("redux-devtools");
const LogMonitor = require("redux-devtools-log-monitor").default;
const DockMonitor = require("redux-devtools-dock-monitor").default;

const DevTools = createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    defaultIsVisible={false}
  >
    <LogMonitor theme="tomorrow" />
  </DockMonitor>
);

module.exports = {DevTools};
