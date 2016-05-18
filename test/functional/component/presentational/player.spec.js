"use strict";

var assign = Object.assign;
var Component = require("app/component/presentational/player");
var React = require("react");
var ReactTestUtils = require("react-addons-test-utils");
var sinon = require("sinon");
var test = require("tape");

var suiteDesc = "functional/component/presentational/player : ";
var desc;

function noop () {}

var requiredProps = {
  changeName: noop,
  changeScore: noop,
  score: 0,
  index: 0,
}

desc = suiteDesc + "calls score change handler";
test(desc, function (t) {
  var index = 0;

  var componentNode;
  var component;
  var props = assign({}, requiredProps, {
    changeScore: sinon.spy(),
  });

  ReactTestUtils.renderIntoDocument(
    <div ref={ref => componentNode = ref}>
      <Component
        index={index} ref={ref => component = ref}
        {...props}
      />
    </div>
  );

  function getScoreEl () {
    return componentNode.children[0].querySelector(".score input");
  }

  var newScore = 1234;
  getScoreEl().value = String(newScore);
  ReactTestUtils.Simulate.change(getScoreEl());

  t.deepEqual(
    props.changeScore.args[0],
    [index, String(newScore)],
    "props.changeScore() was called with expected args"
  );

  t.end();
});

desc = suiteDesc + "calls name change handler";
test(desc, function (t) {
  var index = 0;

  var componentNode;
  var component;
  var props = assign({}, requiredProps, {
    changeName: sinon.spy(),
  });

  ReactTestUtils.renderIntoDocument(
    <div ref={ref => componentNode = ref}>
      <Component
        index={index} ref={ref => component = ref}
        {...props}
      />
    </div>
  );

  function getNameEl () {
    return componentNode.children[0].querySelector(".name input");
  }

  var newName = "Whatever";
  getNameEl().value = newName;
  ReactTestUtils.Simulate.change(getNameEl());

  t.deepEqual(
    props.changeName.args[0],
    [index, newName],
    "props.changeName() was called with expected args"
  );

  t.end();
});

desc = suiteDesc + "calls set-control click handler";
test(desc, function (t) {
  var index = 0;

  var componentNode;
  var component;
  var props = assign({}, requiredProps, {
    takeControl: sinon.spy(),
  });

  ReactTestUtils.renderIntoDocument(
    <div ref={ref => componentNode = ref}>
      <Component
        index={index} ref={ref => component = ref}
        {...props}
      />
    </div>
  );

  ReactTestUtils.Simulate.click(
    componentNode.children[index].querySelector(".set-has-control a")
  );

  t.deepEqual(
    props.takeControl.args[0],
    [{index}],
    "props.takeControl() was called with expected args"
  );

  t.end();
});

desc = suiteDesc + "calls delete click handler";
test(desc, function (t) {
  var index = 0;

  var componentNode;
  var component;
  var props = assign({}, requiredProps, {
    delete: sinon.spy(),
  });

  ReactTestUtils.renderIntoDocument(
    <div ref={ref => componentNode = ref}>
      <Component
        index={index} ref={ref => component = ref}
        {...props}
      />
    </div>
  );

  ReactTestUtils.Simulate.click(
    componentNode.children[index].querySelector(".delete a")
  );

  t.deepEqual(
    props.delete.args[0],
    [{index}],
    "props.delete() was called with expected args"
  );

  t.end();
});
