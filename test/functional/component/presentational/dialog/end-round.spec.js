"use strict";

var assign = Object.assign;
var Component = require("app/component/presentational/dialog/end-round");
var React = require("react");
var ReactTestUtils = require("react-addons-test-utils");
var sinon = require("sinon");
var test = require("tape");

var suiteDesc = "functional/component/presentational/dialog/end-round : ";
var desc;

function noop () {}

var requiredProps = {
  round: 1,
  endRound: noop,
  close: noop,
}

desc = suiteDesc + "calls close handler";
test(desc, function (t) {
  var props = assign({}, requiredProps, {
    close: sinon.spy(),
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

desc = suiteDesc + "calls end round handler";
test(desc, function (t) {
  var props = assign({}, requiredProps, {
    endRound: sinon.spy(),
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
    componentNode.querySelector("button.yes")
  );

  t.deepEqual(
    props.endRound.callCount,
    1,
    "props.endRound() was called"
  );

  t.end();
});
