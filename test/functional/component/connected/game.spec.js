"use strict";

var Component = require("app/component/connected/game");
var createStore = require("app/store/game");
var React = require("react");
var ReactDOM = require("react-dom");
var ReactRedux = require("react-redux");
var ReactTestUtils = require("react-addons-test-utils");
var test = require("tape");

var suiteDesc = "functional/component/connected/game : ";
var desc;

desc = suiteDesc + "adds player";
test(desc, function (t) {
  var store = createStore();

  var component;
  var componentNode;

  ReactTestUtils.renderIntoDocument(
    <ReactRedux.Provider store={store}>
      <Component ref={ref => component = ref} />
    </ReactRedux.Provider>
  );

  componentNode = ReactDOM.findDOMNode(component);

  var state = store.getState();

  var addPlayer = componentNode.querySelector(".add-player a");

  ReactTestUtils.Simulate.click(addPlayer);

  t.equal(
    store.getState().players.length,
    state.players.length + 1,
    "New player in store"
  );

  t.end();
});
