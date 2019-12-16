"use strict";

var assign = Object.assign;
var Component = require("app/component/presentational/dialog/end-game");
var React = require("react");
var ReactTestUtils = require("react-addons-test-utils");
var sinon = require("sinon");
var test = require("tape");

var suiteDesc = "functional/component/presentational/dialog/end-game : ";
var desc;

desc = suiteDesc + "calls close handler";
test(desc, function (t) {
  var props = assign({}, {
    close: sinon.spy(),
    endGame: sinon.spy(),
  });

  var componentNode;

  ReactTestUtils.renderIntoDocument(
    <div ref={ref => componentNode = ref}>
      <Component
        {...props}
      />
    </div>
  );

  ReactTestUtils.Simulate.click(
    componentNode.querySelector("button.no")
  );

  t.deepEqual(
    props.close.callCount,
    1,
    "props.close() was called"
  );

  t.end();
});
