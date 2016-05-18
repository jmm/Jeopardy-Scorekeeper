"use strict";

var Component = require("app/component/connected/dialog/end-round");
var createStore = require("app/store/game");
var React = require("react");
var ReactDOM = require("react-dom");
var ReactRedux = require("react-redux");
var ReactTestUtils = require("react-addons-test-utils");
var test = require("tape");

var suiteDesc = "functional/component/connected/dialog/end-round : ";

test(suiteDesc + "cancels correctly", function (t) {
  var store = createStore();

  store.dispatch({
    type: "ADVANCE_ROUND",
  });

  store.dispatch({
    type: "OPEN_DIALOG",
    payload: {},
  });

  t.equal(
    store.getState().ui.dialog_stack.length,
    1,
    "Dialog stack has length = 1"
  );

  var component;
  var componentNode;

  ReactTestUtils.renderIntoDocument(
    <ReactRedux.Provider store={store}>
      <Component ref={ref => component = ref} />
    </ReactRedux.Provider>
  );

  componentNode = ReactDOM.findDOMNode(component);

  ReactTestUtils.Simulate.click(
    componentNode.querySelector(".dialog button.no")
  );

  t.equal(
    store.getState().ui.dialog_stack.length,
    0,
    "Dialog stack is empty"
  );

  t.end();
});
